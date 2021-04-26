const { check } = require('express-validator');

exports.validSign = [
  check('firstName', 'First Name is required')
    .isAlpha()
    .isLength({
      min: 3,
      max: 32,
    })
    .withMessage('First Name must be between 3 to 32 characters'),
  check('lastName', 'Last Name is required')
    .isAlpha()
    .isLength({
      min: 3,
      max: 32,
    })
    .withMessage('Last Name must be between 3 to 32 characters'),
  check('contactNumber', 'Contact number is required').isLength({
    min:10,
    max: 10
  }).withMessage("Enter a valid phone number")
  .isMobilePhone(),
  check('otp', 'Enter OTP')
    .isNumeric()
    .withMessage('Invaid OTP Try again'),
  check('email').normalizeEmail().isEmail().withMessage('Must be a valid email address'),
];



exports.validLogin = [
  check('email').isEmail().normalizeEmail().withMessage('Must be a valid email address'),
  check('otp', 'Enter OTP')
    .notEmpty()
    .isNumeric()
    .withMessage('Invaid OTP Try again'),
];

exports.validSendOTP = [
  check('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be a valid email address'),
];

