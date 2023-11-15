const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();

const errorHandler = require('./controllers/errorController');
const appError = require('./utility/appError');
const userRouter = require('./routes/userRoutes');
const taskRouter = require('./routes/taskRoutes');
const projectRouter = require('./routes/projectRoutes');
const viewRouter = require('./routes/viewRoutes');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(`${__dirname}/public`));

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/', viewRouter);
app.use('/api/v1/projects/', projectRouter);
app.use('/api/v1/users/', userRouter);
app.use('/api/v1/tasks', taskRouter);
app.all('*', (req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.all('*', (req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);
module.exports = app;
