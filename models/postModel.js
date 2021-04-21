const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Blood = Object.freeze({
  'A+': 'A+',
  'A-': 'A-',
  'B+': 'B+',
  'B-': 'B-',
  'O+': 'O+',
  'O-': 'O-',
  'AB+': 'AB+',
  'AB-': 'AB-',
});
const Genders = Object.freeze({
  Male: 'Male',
  Female: 'Female',
  Other: 'Other',
});

const postSchema = new Schema(
  {
    Location: {
      City: {
        type: String,
        require: true,
        index: true,
      },
      District: {
        type: String,
        require: true,
        index: true,
      },
      State: {
        type: String,
        require: true,
      },
    },
    gender: {
      type: String,
      enum: Object.values(Genders),
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    blood_group: {
      type: String,
      enum: Object.values(Blood),
    },
    Covid_Recovery_Date: {
      type: Date,
      require: true,
    },
    age: { type: Number, require: true },
    Report: {
      already_donated: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      fraud: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      other: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      already_donated_number: {
        type: Number,
      },
      fraud_number: {
        type: Number,
      },
      other_number: {
        type: Number,
      },
    },
  },
  { timestamps: true }
);

Object.assign(postSchema.statics, {
  Blood,
  Genders,
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
