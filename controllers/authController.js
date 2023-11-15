const crypto = require('crypto');
const bcrypt = require('bcrypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const appError = require('./../utility/appError');
const catchAsync = require('./../utility/catchAsync');
const User = require('./../models/userModel');
const Email = require('./../utility/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

// PROTECT FOR API
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  )
    token = req.headers.authorization.split(' ')[1];
  else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // console.log(token);
  if (!token)
    return next(new appError('You are not logged in!Please Login', 401));
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new appError('User not exists', 401));
  }
  if (currentUser.changedPasswordAfter(decoded.iat))
    return next(
      new appError('User recently changed password! Please log in again.', 401)
    );
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// PROTECT FOR PRODUCTION
exports.loggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) return next();
      if (currentUser.changedPasswordAfter(decoded.iat)) return next();
      res.locals.user = currentUser;
      req.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  return next(new appError('You are not logged in,Please Login...', 400));
});

exports.signup = catchAsync(async (req, res, next) => {
  const mail = req.body.email;
  const pass = req.body.password;
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    department: req.body.department,
    role: req.body.role,
  });
  const url = '/login';
  // console.log('Signup Function');
  // await new Email({ mail, pass }, url).sendWelcome();
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password)
    return next(new appError('Provide email and Password', 400));
  const user = await User.findOne({ email: email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new appError('Incorrect Credentials', 401));
  createSendToken(user, 201, res);
});

exports.logout = (req, res) => {
  // console.log('Logging out');
  if (req.cookies) {
    // console.log('cookies out');
    res.cookie('jwt', 'null', {
      expiresIn: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
  }
  res.status(200).json({
    status: 'success',
  });
};

exports.restrictTo = (role) => {
  return (req, res, next) => {
    if (req.user.id !== role)
      return next(new appError("You don't have access to this Route", 403));
    next();
  };
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.correctPassword(req.body.currentPassword, user.password)))
    return next(new appError('Password provided is wrong', 401));
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  createSendToken(user, 201, res);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new appError('There is no user with email address.', 404));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  try {
    // await new Email(user, resetURL).sendPasswordReset();
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new appError('Error occured!! Try again later..'), 500);
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new appError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res);
});
