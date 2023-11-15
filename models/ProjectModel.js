const mongoose = require('mongoose');
const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name Required'],
    },
    description: {
      type: String,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'users',
      // required: ''
    },
    status: {
      type: String,
      default: 'In Progress',
      enum: ['In Progress', 'Completed'],
    },
    date: {
      type: Date,
      required: [false],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

projectSchema.virtual('tasks', {
  ref: 'tasks',
  foreignField: 'project',
  localField: '_id',
});

// projectSchema.pre(/^find/, function (next) {
//   this.populate({ path: 'tasks' });
//   next();
// });

projectSchema.pre('save', function (next) {
  this.date = new Date(this.date);
  next();
});

const projects = mongoose.model('projects', projectSchema);
module.exports = projects;
