const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };

// How to Use in app.js

// const { errorHandler } = require('./middleware/error.middleware');

// ... other middlewares and routes

// app.use(errorHandler); // Add after all routes