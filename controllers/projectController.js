const Project = require('./../models/ProjectModel');
const catchAsync = require('./../utility/catchAsync');
const appError = require('./../utility/appError');
const crudFactory = require('./../utility/crudFactory');

exports.getAllProjects = crudFactory.getAll(Project, [
  {
    path: 'tasks',
    populate: {
      path: 'user',
      select: '-__v -role -skills',
    },
  },
]);
exports.createProject = crudFactory.createOne(Project);
exports.getProject = crudFactory.getOne(Project, [
  {
    path: 'tasks',
    populate: {
      path: 'user',
      select: '-__v -role -skills',
    },
  },
]);
exports.updateProject = crudFactory.updateOne(Project);
exports.deleteProject = crudFactory.deleteOne(Project);

// exports.getAllProjects = catchAsync(async (req, res, next) => {
//   console.log('gett All Projects function');
//   const data = await Project.find().populate('tasks');
//   if (!data) return next(new appError('Error Occured', 404));
//   res.status(200).json({
//     status: 'success',
//     data,
//   });
// });

// exports.getProject = catchAsync(async (req, res, next) => {
//   console.log('gett Project function');
//   console.log(req.params.id);
//   const data = await Project.findById(req.params.id).populate('tasks');
//   if (!data) return next(new appError('Error Occured', 404));
//   res.status(200).json({
//     status: 'success',
//     data,
//   });
// });
