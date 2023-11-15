const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const appError = require('./../utility/appError');
const catchAsync = require('./../utility/catchAsync');
const express = require('express');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.protect, authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);
router.patch('/updatePassword', authController.updatePassword);
router.patch(
  '/updateUserData',
  userController.uploadImage,
  userController.resizeImage,
  userController.updateUserData
);
// router.use(authController.restrictTo('manager'));
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUserData)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
