const User = require('./../models/userModel');
const Task = require('./../models/taskModel');
const Project = require('./../models/ProjectModel');
const catchAsync = require('./../utility/catchAsync');
const appError = require('./../utility/appError');

exports.profile = catchAsync(async (req, res) => {
  // console.log(req.user.role);
  // console.log(user);
  res.status(200).render('profile', {
    title: `Profile | ${req.user.name}`,
  });
});

exports.login = catchAsync(async (req, res) => {
  res.status(200).render('login', {
    title: 'PMT| Login',
  });
});
exports.logout = catchAsync(async (req, res) => {
  res.status(200).render('login', {
    title: 'PMT| Logout',
  });
});

exports.dashboard = catchAsync(async (req, res) => {
  const user = User.findById(req.user.id);
  if (req.user.role === 'employee') {
    const { tasks } = await user
      .populate({
        path: 'tasks',
        populate: { path: 'project', select: 'name id' },
      })
      .select('tasks');
    // console.log(tasks);
    return res.status(200).render('dashboard', {
      title: 'PMT| Dashboard',
      // tasks: req.user.tasks,
      tasks,
    });
  } else if (req.user.role === 'manager') {
    const { projects } = await user.populate({
      path: 'projects',
      populate: { path: 'tasks' },
      // populate: { path: 'project', select: 'name id' },
    });
    // .select('tasks');
    // console.log(tasks);
    return res.status(200).render('dashboard', {
      title: 'PMT| Dashboard',
      // tasks: req.user.tasks,
      projects,
    });
  }
});

// let projectSelect =

exports.projectmanagement = catchAsync(async (req, res) => {
  const manager = await User.findById(req.user.id).populate('projects');
  const userslist = await User.find().select('name id department');
  // console.log(userslist);
  const projectList = manager.projects;
  let project;
  if (req.params.id) {
    project = await Project.findById(req.params.id).populate({
      path: 'tasks',
      select: '-__v',
      populate: { path: 'user' },
    });
  } else {
    project = await Project.findById(projectList[0]._id).populate({
      path: 'tasks',
      select: '-__v',
      populate: { path: 'user' },
    });
  }

  // console.log(project);
  // const project = await Project.findById()
  return res.status(200).render('projectManagement', {
    title: `PMT| ${project.name}`,
    userslist,
    manager,
    project,
  });
});

exports.userManagement = catchAsync(async (req, res) => {
  const users = await User.find({ role: { $eq: 'employee' } });
  // console.log(users);
  res.status(200).render('userManagement', {
    title: 'PMT| Users',
    users,
  });
});
exports.userProfile = catchAsync(async (req, res) => {
  // console.log(req.params.id);
  const emp = await User.findById(req.params.id);
  // console.log(user);
  res.status(200).render('empProfile', {
    title: 'PMT| User',
    emp,
  });
});

exports.createAccount = catchAsync(async (req, res) => {
  res.status(200).render('createAccount');
});

exports.support = catchAsync(async (req, res) => {
  res.status(200).render('support');
});
exports.tasks = catchAsync(async (req, res) => {
  // console.log(req.user.role);
  if (req.user.role === 'employee') {
    const userdata = await User.findById(req.user.id).populate({
      path: 'tasks',
      select: '-__v',
      populate: {
        path: 'project',
      },
    });

    let task;
    if (req.params.id) {
      task = await Task.findById(req.params.id).populate({
        path: 'project',
        select: '-__v',
      });
    } else {
      // SEND EMPTY
    }

    return res.status(200).render('tasks', {
      userdata,
      task,
    });
  } else {
    const userdata = await User.findById(req.user.id).populate({
      path: 'projects',
    });

    let project;
    if (req.params.id) {
      project = await Project.findById(req.params.id).populate({
        path: 'tasks',
        select: '-__v',
      });
    } else {
      // SEND EMPTY
    }

    return res.status(200).render('projects', {
      userdata,
      project,
    });
  }
});
