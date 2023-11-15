const Task = require('./../models/taskModel');
const catchAsync = require('./../utility/catchAsync');
const appError = require('./../utility/appError');
const crudFactory = require('./../utility/crudFactory');

exports.getAllTasks = crudFactory.getAll(Task, [
  {
    path: 'user',
    select: '-__v -role -skills',
  },
  {
    path: 'project',
    select: '-__v',
  },
]);

exports.createTask = crudFactory.createOne(Task);

exports.getTask = crudFactory.getOne(Task, [
  {
    path: 'user',
    select: '-__v -role -skills',
  },
  {
    path: 'project',
    select: '-__v',
  },
]);
exports.updateTask = crudFactory.updateOne(Task);
exports.deleteTask = crudFactory.deleteOne(Task);
