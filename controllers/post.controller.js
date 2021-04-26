const Post = require('../models/postModel');
const { Blood, Genders } = require('../models/postModel');
const { validationResult } = require('express-validator');
const ApiError = require('../Errorhandler/APIerror');
const User = require('../models/userModel');
const { errorHandler } = require('../Errorhandler/authErrorHandling');

module.exports.PostList = async (req, res, next) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  // const endIndex = page * limit;
  const results = {};

  var obj = { $and: [] };
  if (req.query.place) {
    var query = { $regex: req.query.place, $options: 'i' };
    var place_query = {
      $or: [
        { 'Location.City': query },
        { 'Location.District': query },
        { 'Location.State': query },
      ],
    };
    obj.$and.push(place_query);
  }

  if (req.query.blood_group) {
    var blood_group_query = { blood_group: req.query.blood_group };
    obj.$and.push(blood_group_query);
  }

  if (!req.query.place && !req.query.blood_group) {
    var obj = {};
  }

  try {
    const posts = await Post.find(obj)
      .limit(limit)
      .skip(startIndex)
      // .populate('author', '_id')
      .lean()
      .exec();

    // if (endIndex < (await Post.find(obj).countDocuments().exec()))
    //   results.next = {
    //     page: page + 1,
    //     limit: limit,
    //   };

    // if (startIndex > 0) {
    //   results.previous = {
    //     page: page - 1,
    //     limit: limit,
    //   };
    // }

    results.totalPages = Math.ceil(
      (await Post.find(obj).countDocuments().exec()) / limit
    );
    results.results = posts;

    return res.status(200).json(results);
  } catch (error) {
    console.log(error);
    return next(
      ApiError.InternalServerError('Server down try after some time')
    );
  }
};

module.exports.PostCreate = async (req, res, next) => {
  try {
    const {
      City,
      District,
      State,
      Covid_Recovery_Date,
      firstName,
      lastName,
      age,
      gender,
      blood_group,
      contactNumber,
      email,
    } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors
        .array()
        .map(error => ({ [error.param]: error.msg }));
      return next(new ApiError(422, firstError));
    } else {
      var theUser = await User.findOne({ email: email }).lean();
      if (theUser) {
        const userPosts = await Post.find({ author: theUser._id }).lean();
        if (userPosts.length > 1) {
          return next(ApiError.badRequest("Can't create more than 2 posts"));
        }
      }
      if (!theUser) {
        try {
          theUser = await User.create({
            firstName,
            lastName,
            contactNumber,
            email,
          });
          await theUser.save();
        } catch (error) {
          console.log(error);
          return res.status(400).json({ error: errorHandler(error) });
        }
      }

      const newPost = await Post.create({
        Location: {
          City,
          District,
          State,
        },
        age,
        Covid_Recovery_Date,
        author: theUser._id,
        firstName,
        lastName
      });
      newPost.blood_group = Blood[blood_group];
      newPost.gender = Genders[gender];
      await newPost.save();
      return res.status(201).json({ newPost });
    }
  } catch (error) {
    console.log(error);
    return next(ApiError.InternalServerError('Something went wrong'));
  }
};

module.exports.PostReport = async (req, res, next) => {
  try {
    const { already_donated, fraud, other } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors
        .array()
        .map(error => ({ [error.param]: error.msg }));
      return next(new ApiError(422, firstError));
    } else {
      const postID = req.params.id;
      const post = await Post.findById(postID);
      if (!post) {
        next(ApiError.badRequest('No post found'));
        return;
      }

      if (already_donated) {
        if (post.Report.already_donated.includes('607aa9b261bdc63ff8d2c790')) {
          return res.status(200).json('Already reported the post');
        } else {
          post.Report.already_donated.push('607aa9b261bdc63ff8d2c790');
          post.Report.already_donated_number =
            post.Report.already_donated.length;
          await post.save();
          return res
            .status(200)
            .json('Reported successfully for already donated');
        }
      } else if (fraud) {
        if (post.Report.fraud.includes('607aa9b261bdc63ff8d2c790')) {
          return res.status(200).json('Already reported the post');
        } else {
          post.Report.fraud.push('607aa9b261bdc63ff8d2c790');
          post.Report.fraud_number = post.Report.fraud.length;
          await post.save();
          return res.status(200).json('Reported successfully for fraud');
        }
      } else if (other) {
        if (post.Report.other.includes('607aa9b261bdc63ff8d2c790')) {
          return res.status(200).json('Already reported the post');
        } else {
          post.Report.other.push('607aa9b261bdc63ff8d2c790');
          post.Report.other_number = post.Report.other.length;
          await post.save();
          return res.status(200).json('Reported successfully');
        }
      }
      return next(ApiError.badRequest('Empty Request'));
    }
  } catch (error) {
    console.log(error);
    return next(ApiError.InternalServerError('Something went wrong'));
  }
};

module.exports.PostDetail = async (req, res, next) => {
  try {
    const postID = req.params.id;
    const post = await Post.findById(postID).populate('author').lean();
    return res.status(200).json(post);
  } catch (error) {
    console.log(error.path);
    if (error.path === '_id') {
      return next(ApiError.NotFound('No post found'));
    }
    return next(ApiError.InternalServerError('Something went wrong'));
  }
};

module.exports.PostDelete = async (req, res, next) => {
  try {
    const { postID } = req.body;
    console.log(postID);
    const post = await Post.findById(postID);
    console.log(post);
    if (!post) {
      next(ApiError.NotFound('No post found'));
      return;
    } else {
      if (post.author.toString() == req.session.user._id.toString()) {
        await post.delete();
        return res.status(202).send(post._id);
      } else {
        return next(
          ApiError.Forbidden('Only author of the post can delete the post')
        );
      }
    }
  } catch (error) {
    console.log(error);
    return next(ApiError.InternalServerError('Something went wrong'));
  }
};

module.exports.PostUpdate = async (req, res, next) => {
  try {
    const {
      postID,
      City,
      District,
      State,
      Covid_Recovery_Date,
      age,
      blood_group,
      gender,
    } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors
        .array()
        .map(error => ({ [error.param]: error.msg }));
      return next(new ApiError(422, firstError));
    } else {
      const post = await Post.findById(postID);
      if (!post) {
        next(ApiError.NotFound('No post found'));
        return;
      } else {
        if (post.author.toString() == req.session.user._id.toString()) {
          if (City && District && State) {
            post.Location.City = City;
            post.Location.District = District;
            post.Location.State = State;
          }
          if (Covid_Recovery_Date) {
            post.Covid_Recovery_Date = Covid_Recovery_Date;
          }
          if (age) {
            post.age = age;
          }
          if (blood_group) {
            post.blood_group = Blood[blood_group];
          }
          if (gender) {
            post.gender = Genders[gender];
          }
          const updatedPost = await post.save();
          res.status(200).send(updatedPost);
        } else {
          return next(
            ApiError.Forbidden('Only author of the post can edit the post')
          );
        }
      }
    }
  } catch (error) {
    return next(ApiError.InternalServerError('Something went wrong'));
  }
};

module.exports.UserPosts = async (req, res, next) => {
  try {
    console.log(req.session.user);
    const userPosts = await Post.find({ author: req.session.user._id })
      .populate('author', '_id firstName lastName')
      .lean()
      .exec();
    console.log(userPosts);
    res.status(200).json(userPosts);
  } catch (error) {
    return next(ApiError.InternalServerError('Something went wrong'));
  }
};
