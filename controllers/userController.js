const User = require('./../models/userModel');
const catchAsync = require('./../utility/catchAsync');
const appError = require('./../utility/appError');
const crudFactory = require('./../utility/crudFactory');
const multer = require('multer');
const sharp = require('sharp');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new appError('Only Images are Allowed', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadImage = upload.single('photo');

exports.resizeImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now().jpeg}`;
  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 100 })
    .toFile(`public/images/users/${req.file.filename}`);
  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  // if (req.body.password || req.body.passwordConfirm) {
  //   return next(new appError('This route is not for password updates.', 400));
  // }
  const filteredBody = filterObj(
    req.body,
    'name',
    'mobile',
    'skills',
    'department'
  );
  if (req.file) {
    filteredBody.photo = req.file.filename;
  }
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.getAllUsers = crudFactory.getAll(User);

exports.getUser = crudFactory.getOne(User, {
  path: 'tasks',
  select: '-__v ',
  populate: {
    path: 'project',
    select: '-__v ',
  },
});

// if (req.user.role === 'manager')
//   exports.getUser = crudFactory.getOne(User, {
//     path: 'tasks',
//     select: '-__v ',
//     populate: {
//       path: 'project',
//       select: '-__v ',
//     },
//   });

exports.getUserData = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (user.role === 'manager') {
    const data = await User.findById(req.params.id).populate({
      path: 'projects',
      select: '-__v',
      populate: {
        path: 'tasks',
        select: '-__v',
      },
    });
    return res.status(200).json({
      status: 'success',
      data,
    });
  }

  const data = await User.findById(req.params.id).populate({
    path: 'tasks',
    select: '-__v ',
    populate: {
      path: 'project',
      select: '-__v ',
    },
  });
  return res.status(200).json({
    status: 'success',
    data,
  });
});
exports.updateUser = crudFactory.updateOne(User);
exports.deleteUser = crudFactory.deleteOne(User);
exports.createUser = crudFactory.createOne(User);
