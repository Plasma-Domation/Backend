const { check } = require('express-validator');


exports.validUserUpdate = [
  check('userID', 'Enter post id')
    .notEmpty()
    .withMessage('Invaid userID'),
  check('firstName', 'First Name is required')
  .optional()
  .isAlpha()
  .isLength({
    min: 2,
    max: 32,
  })
  .withMessage('First Name must be between 2 to 32 characters'),
check('lastName', 'Last Name is required')
.optional()
  .isAlpha()
  .isLength({
    min: 2,
    max: 32,
  })
  .withMessage('Last Name must be between 2 to 32 characters'),
];

