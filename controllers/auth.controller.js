const User = require('../models/userModel');
const OTP = require('../models/otpModel');
const ApiError = require('../Errorhandler/APIerror');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { errorHandler } = require('../Errorhandler/authErrorHandling');
const { json } = require('express');

module.exports.sendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors
        .array()
        .map(error => ({ [error.param]: error.msg }));
      return next(new ApiError(422, firstError));
    } else {
      const otpObj = await OTP.findOne({ email });
      var otpToSend = '';

      if (otpObj) {
        otpObj.otp = Math.floor(100000 + Math.random() * 900000);
        await otpObj.save();
        otpToSend = otpObj.otp;
      } else {
        const newOTPobj = await OTP.create({
          email,
          otp: Math.floor(100000 + Math.random() * 900000),
        });
        otpToSend = newOTPobj.otp;
      }
      const oAuth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLEINT_SECRET,
        process.env.REDIRECT_URI
      );
      oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
      const accessToken = await oAuth2Client.getAccessToken();

      const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.EMAIL_FROM,
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLEINT_SECRET,
          refreshToken: process.env.REFRESH_TOKEN,
          accessToken: accessToken,
        },
      });

      const mailOptions = {
        from: `Plasma Donation 🧁 <${process.env.EMAIL_FROM}>`,
        to: `${email}`,
        subject: 'Get your email verified',
        text: `Your OTP is: ${otpToSend}`,
        html: `<h1>Your OTP is: ${otpToSend}</h1>`,
      };

      // transport.sendMail(mailOptions, function (error, info) {
      //   if (error) {
      //     console.log(error);
      //     return res.status(400).json(error);
      //   } else {
      //     console.log('Email sent: ' + info.response);
      //     res.status(200).send('Email sent: ' + info.response);
      //   }
      // });

      res.status(201).send(otpToSend);
      // res.status(201).json({Message: "Email sent!!"});
    }
  } catch (err) {
    console.log(error);
    return next(ApiError.InternalServerError('Failed to send Email'));
  }
};

module.exports.signUp = async (req, res, next) => {
  try {
    const { firstName, lastName, contactNumber, email } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors
        .array()
        .map(error => ({ [error.param]: error.msg }));
      return next(new ApiError(422, firstError));
    } else {
      const newUser = await User.create({
        firstName,
        lastName,
        email,
        contactNumber,
      });
      req.session.user = newUser;
      return res
        .status(201)
        .json({
          user: {
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            _id: newUser._id,
          },
        });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: errorHandler(error) });
  }
};

module.exports.login_post = async (req, res, next) => {
  try {
    const { email } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors
        .array()
        .map(error => ({ [error.param]: error.msg }));
      next(new ApiError(422, firstError));
      return;
    } else {
      const user = await User.findOne({ email })
        .lean()
        .select('firstName', 'lastName');
      if (!user) {
        next(ApiError.badRequest('Invalid credentials'));
        return;
      }
      req.session.user = user;
      return res.status(200).json({ user: user });
    }
  } catch (error) {
    console.log(error);
    return next(ApiError.InternalServerError('Failed to login'));
  }
};

module.exports.logout_delete = (req, res, next) => {
  req.session.destroy(function (err) {
    if (err) {
      next(ApiError.Unauthorized('Failed to log out'));
      return;
    } else {
      res.sendStatus(204);
    }
  });
};

module.exports.checkSession = (req, res, next) => {
  if (req.session.user) {
    return res.status(200).json({
      auth: true,
      user: req.session.user,
    });
  }
  return res.status(200).json({
    auth: false,
    error: 'User not signned',
  });
};
