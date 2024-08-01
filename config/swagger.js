const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'User Management System API',
        version: '1.0.0',
        description: 'API documentation for the User Management System',
      },
      servers: [
        {
          url: 'http://localhost:8000',
          description: 'Development server',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
        schemas: {
          User: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                description: 'User ID',
              },
              firstName: {
                type: 'string',
                description: 'User first name',
              },
              lastName: {
                type: 'string',
                description: 'User last name',
              },
              username: {
                type: 'string',
                description: 'User username',
              },
              email: {
                type: 'string',
                description: 'User email',
              },
            },
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    apis: ['./routes/api/*.js'], // Path to the API docs
  };

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
