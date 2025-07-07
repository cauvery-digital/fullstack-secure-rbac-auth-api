// ✅ Step 1: Install Packages

// npm install helmet cors express-rate-limit hpp xss-clean

// ✅ Step 2: Secure Middleware Setup in server.js

// server.js
const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const hpp = require('hpp');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');// server.js
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');


dotenv.config();

const app = express();

// 🌐 Security Middlewares
app.use(helmet());                         // Sets secure headers
app.use(cors({
  origin: 'http://localhost:3000',        // Frontend origin
  credentials: true,
}));
app.use(hpp());                            // Prevent HTTP Param Pollution
app.use(xss());                            // Sanitize user input
app.use(cookieParser());                   // Read cookies
app.use(express.json());                   // JSON body parser

// 🚫 Rate Limiting
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 mins
  max: 100,                 // Limit each IP to 100 requests
  message: 'Too many requests, please try again later.',
});
app.use('/api', limiter); // Apply to API routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Swagger UI for API docs
// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));