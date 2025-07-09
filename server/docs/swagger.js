// docs/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My Auth API',
      version: '1.0.0',
      description: 'JWT Auth API with Email Verification and RBAC',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Local Dev',
      },
    ],
  },
  apis: ['./routes/*.js'], // where your route comments live
};

module.exports = swaggerJSDoc(options);
