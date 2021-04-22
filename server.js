const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('./middlewares/session');
// Custom imports
require('dotenv').config({ path: './config/config.env' });
require('./config/MongoDB');
const ApiError = require('./Errorhandler/APIerror');
const apiErrorHandler = require('./middlewares/api_error_handling');

// APP
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
// app.options('*', cors);
app.use(
  cors()
);
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
  );
  next();
});
app.use(session);

// PORT for app
PORT = process.env.PORT || 5000;
app.listen(PORT);

//Load all routes
const postRoutes = require('./routes/post.route');
const userRoutes = require('./routes/user.route');
const authRoutes = require('./routes/auth.route');
const pincode_check = require('./routes/pincode_check');

//  Routes
app.use('/api/post', postRoutes);
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/pincode_check', pincode_check);
app.use('/', (req, res, next) => {
  res.status(200).send('Well connected');
});
// if not in our domain routes
app.use((req, res, next) => {
  next(ApiError.NotFound('No route to this site'));
});
app.use(apiErrorHandler);
