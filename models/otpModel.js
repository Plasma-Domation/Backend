const mongoose = require('mongoose');
const { isEmail } = require('validator');

var OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    index: {
      unique: true,
    },
    lowercase: true,
    trim: true,
    validate: [isEmail, 'Please enter a valid email'],
  },
  otp:{
    type: String,
    min: 4,
    max:6
  },
  updatedAt: { type: Date, expires: 300, default: Date.now },
});

const OTP = mongoose.model('OTP', OTPSchema);
module.exports = OTP;
