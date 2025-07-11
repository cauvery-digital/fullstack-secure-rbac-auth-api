const rateLimit = require("express-rate-limit");

// 🚦 Rate Limiting
const rateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 mins
  max: 100,                 // Limit each IP to 100 requests
  message: 'Too many requests, please try again later.',
});

module.exports = rateLimiter;

// app.use('/api', rateLimiter); // Apply to API routes