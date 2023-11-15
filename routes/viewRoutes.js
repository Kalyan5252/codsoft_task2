const express = require('express');
const router = express.Router();
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');

router.get('/', viewController.login);
router.get('/login', viewController.login);

router.get('/profile', authController.loggedIn, viewController.profile);
router.get('/dashboard', authController.loggedIn, viewController.dashboard);
router.get(
  '/projectmanagement',
  authController.loggedIn,
  viewController.projectmanagement
);
router.get(
  '/projectmanagement/:id',
  authController.loggedIn,
  viewController.projectmanagement
);
router.get(
  '/userManagement',
  authController.loggedIn,
  viewController.userManagement
);
router.get(
  '/userManagement/:id',
  authController.loggedIn,
  viewController.userProfile
);
router.get(
  '/createAccount',
  authController.loggedIn,
  viewController.createAccount
);
router.get('/tasks', authController.loggedIn, viewController.tasks);
router.get('/tasks/:id', authController.loggedIn, viewController.tasks);

router.get('/support', authController.loggedIn, viewController.support);

// router.get('/logout', authController.loggedIn, viewController.logout);

module.exports = router;
