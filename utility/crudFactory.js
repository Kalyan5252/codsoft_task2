const catchAsync = require('./catchAsync');
const appError = require('./appError');
exports.getAll = (Model, Opt) =>
  catchAsync(async (req, res, next) => {
    console.log(Opt);
    const data = await Model.find().populate(Opt);
    res.status(200).json({
      status: 'success',
      results: data.length,
      data,
    });
  });

exports.getOne = (Model, Opt) =>
  catchAsync(async (req, res, next) => {
    const data = await Model.findById(req.params.id).populate(Opt);
    res.status(200).json({
      status: 'success',
      data,
    });
  });
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    console.log('get it', req.params.id);
    console.log('get it', req.body);
    const data = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!data) return next(new appError('Document not found!!', 404));
    res.status(200).json({
      status: 'success',
      data,
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const data = await Model.findByIdAndDelete(req.params.id);
    if (!data)
      return next(new appError('Error occured while deleting the Data', 404));
    res.status(200).json({
      status: 'success',
      data: null,
    });
  });
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const data = await Model.create(req.body);
    if (!data)
      return next(new appError('Error occured creating document', 404));
    res.status(200).json({
      status: 'success',
      data,
    });
  });
