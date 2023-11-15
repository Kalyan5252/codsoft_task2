const mongoose = require('mongoose');
const express = require('express');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'UserName is required'],
    },
    email: {
      type: String,
      required: [true, 'Email required'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid Email'],
    },
    skills: [String],
    department: {
      type: String,
      // required: [false,'Department is required'],
      default: '',
      enum: [
        'Analysis',
        'Designing',
        'Development',
        'Testing',
        'Maintainance',
        'Management',
        '',
      ],
      // select: false,
    },
    mobile: {
      type: Number,
      required: [false],
    },
    photo: {
      type: String,
      default: 'default.png',
    },
    role: {
      type: String,
      default: 'employee',
      enum: ['employee', 'manager'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 5,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Password Confirm is required'],
      select: false,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not Same',
      },
      select: false,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual('tasks', {
  ref: 'tasks',
  foreignField: 'user',
  localField: '_id',
});

userSchema.virtual('projects', {
  ref: 'projects',
  foreignField: 'user',
  localField: '_id',
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $eq: true } });
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();

  this.password = await bcrypt.hash(this.password, 10);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  loginPassword,
  userPassword
) {
  return await bcrypt.compare(loginPassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (timeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return timeStamp < changedTimeStamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() * 60 * 1000 * 10;
  return resetToken;
};

const users = mongoose.model('users', userSchema);
module.exports = users;
