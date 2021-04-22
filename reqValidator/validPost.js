const { check, oneOf } = require('express-validator');

exports.validCreate = [
  check('City', 'City is required')

    .isLength({
      max: 55,
    })
    .withMessage('Enter valid pin code for this city'),
  check('District', 'District is required')

    .isLength({
      max: 55,
    })
    .withMessage('Enter valid pin code for this district'),
  check('State', 'State is required')

    .isLength({
      max: 55,
    })
    .withMessage('Enter valid pin code for this state'),
  check('firstName', 'First Name is required')

    .isLength({
      min: 3,
      max: 32,
    })
    .withMessage('First Name must be between 3 to 32 characters'),
  check('lastName', 'Last Name is required')

    .isLength({
      min: 3,
      max: 32,
    })
    .withMessage('Last Name must be between 3 to 32 characters'),
  check('contactNumber', 'Contact number is required').isMobilePhone(),
  check('otp', 'Enter OTP').isNumeric().withMessage('Invaid OTP Try again'),
  check('blood_group').isIn(['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']),
  check('gender').isIn(['Male', 'Female', 'Other']),
  check('Covid_Recovery_Date').trim().isDate(),
  check('age').custom(value => {
    if (parseInt(value) < 18) {
      return Promise.reject('Too younge to donate');
    }
    return true;
  }),

  check('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be a valid email address'),
];

exports.validDelete = [
  check('postID', 'Enter post id').notEmpty().withMessage('Invaid postID'),
];

exports.validUpdate = [
  check('postID', 'Enter post id').notEmpty().withMessage('Invaid postID'),
  check('City', 'City is required').optional().isAlpha().isLength({
    max: 55,
  }),

  check('District', 'District is required').optional().isAlpha().isLength({
    max: 55,
  }),

  check('State', 'State is required').optional().isAlpha().isLength({
    min: 4,
    max: 55,
  }),

  check('blood_group')
    .optional()
    .isIn(['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']),
  check('gender').optional().isIn(['Male', 'Female', 'Other']),
  check('Covid_Recovery_Date').optional().trim().isDate(),
  check('age')
    .optional()
    .custom(value => {
      if (parseInt(value) < 18) {
        return Promise.reject('Too younge to donate');
      }
      return true;
    }),
];
