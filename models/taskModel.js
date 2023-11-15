const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Task name required'],
    },
    description: {
      type: String,
      // required: [true,'Task requries Information about the Task']
      required: [true, 'Task requries Description'],
    },
    department: {
      type: String,
      enum: [
        'Analysis',
        'Designing',
        'Development',
        'Testing',
        'Maintainance',
        'Management',
      ],
    },
    date: {
      type: Date,
      // Required field implement based on manager
      required: [false],
    },
    status: {
      type: String,
      default: 'In Progress',
      enum: ['In Progress', 'Completed'],
    },
    project: {
      type: mongoose.Schema.ObjectId,
      ref: 'projects',
      required: [true, 'Task belongs to a project'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'users',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

taskSchema.pre('save', function (next) {
  this.date = new Date(this.date);
  next();
});
// taskSchema.pre('save',function(next){
//   if(new Date(this.date) > new Date())

//   next();
// })

taskSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'user',
  //   select: '-__v -role -skills',
  // }).populate({
  //   path: 'project',
  //   select: 'name',
  // });
  // this.populate({
  //   path: 'user',
  //   select: '-__v -role -skills',
  // });
  // this.populate({
  //   path: 'project',
  //   select: 'name',
  // });

  next();
});

taskSchema.pre(/^find/, function (next) {
  this.find().sort({ date: 1 });
  next();
});
// taskSchema.virtual('project', {
//   ref: 'projects',
//   foreignField: 'tour',
//   localField: '_id',
// });

const tasks = mongoose.model('tasks', taskSchema);
module.exports = tasks;
