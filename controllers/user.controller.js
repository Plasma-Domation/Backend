const User = require('../models/userModel');
const Post = require('../models/PostModel');
const ApiError = require('../Errorhandler/APIerror');
const { validationResult } = require('express-validator');

module.exports.userDetail = async (req, res, next) => {
  try {
    const userID = req.params.id;
    const user = await User.findById(userID).lean();
    console.log(user);
    if (!user || user._id.toString() != req.session.user._id.toString()) {
      next(ApiError.Unauthorized('Unauthorized'));
      return;
    } else {
      return res.status(200).json(user);
    }
  } catch (error) {
    console.log(error);
    return next(ApiError.InternalServerError('Something went wrong'));
  }
};

module.exports.userUpdate = async (req, res, next) => {
  try {
    const { userID, firstName, lastName } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors
        .array()
        .map(error => ({ [error.param]: error.msg }));
      return next(new ApiError(422, firstError));
    } else {
      const user = await User.findById(userID);
      if (!user) {
        return next(ApiError.NotFound('No user found'));
      } else {
        if (user._id.toString() == req.session.user._id.toString()) {
          if (firstName) {
            user.firstName = firstName;
          }
          if (lastName) {
            user.lastName = lastName;
          }
          const updatedUser = await user.save();
          res.status(200).send(updatedUser);
        } else {
          return next(ApiError.Forbidden("Can't edit the information"));
        }
      }
    }
  } catch (error) {
    console.log(error);
    return next(ApiError.InternalServerError('Something went wrong'));
  }
};

module.exports.userDelete = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) {
      next(ApiError.NotFound('No user found'));
      return;
    } else {
      if (user._id.toString() == req.session.user._id.toString()) {
        const userPosts = await Post.find({ author: req.session.user._id });
        userPosts.forEach(element => {
          element.delete();
        });
        user.delete();
        return res.status(204).send('User deleted');
      } else {
        return next(ApiError.Forbidden('Can not delete the user'));
      }
    }
  } catch (error) {
    console.log(error);
    return next(ApiError.InternalServerError('Something went wrong'));
  }
};
