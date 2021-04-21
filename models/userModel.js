const mongoose = require('mongoose');
const { isEmail } = require('validator');


const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
   
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
    contactNumber: {
      type: Number,
      require: true,
      index: {
        unique: true,
      },
      trim: true,
    },
  },
  { timestamps: true }
);



const User = mongoose.model('User', userSchema);
module.exports = User;
