import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Example API',
    version: '1.0.0',
    description: 'REST API built with Node.js, TypeScript, and DDD principles. Use the "Try it out" button to test endpoints directly from this interface.',
    contact: {
      name: 'API Support',
      email: 'support@example.com',
    },
    license: {
      name: 'ISC',
      url: 'https://opensource.org/licenses/ISC',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
    {
      url: 'https://api.example.com',
      description: 'Production server',
    },
  ],
  tags: [
    {
      name: 'Health',
      description: 'Health check endpoints for monitoring API and system status'
    },
    {
      name: 'Users',
      description: 'User management operations (CRUD)'
    }
  ],
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Unique identifier for the user',
          },
          name: {
            type: 'string',
            description: 'User first name',
            minLength: 2,
            maxLength: 50,
          },
          lastName: {
            type: 'string',
            description: 'User last name',
            minLength: 2,
            maxLength: 50,
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
          },
          state: {
            type: 'string',
            enum: ['Active', 'Suspended', 'Deleted'],
            description: 'User account state',
            default: 'Active',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'User creation timestamp',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'User last update timestamp',
          },
        },
        required: [
          'id',
          'name',
          'lastName',
          'email',
          'state',
          'createdAt',
          'updatedAt',
        ],
      },
      CreateUserRequest: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'User first name',
            minLength: 2,
            maxLength: 50,
            example: 'John',
          },
          lastName: {
            type: 'string',
            description: 'User last name',
            minLength: 2,
            maxLength: 50,
            example: 'Doe',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
            example: 'john.doe@example.com',
          },
        },
        required: ['name', 'lastName', 'email'],
        example: {
          name: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
        },
      },
      UpdateUserRequest: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'User first name',
            minLength: 2,
            maxLength: 50,
            example: 'Jane',
          },
          lastName: {
            type: 'string',
            description: 'User last name',
            minLength: 2,
            maxLength: 50,
            example: 'Smith',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
            example: 'jane.smith@example.com',
          },
        },
        example: {
          name: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
        },
      },
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            description: 'Error message',
            example: 'Validation failed',
          },
          errors: {
            type: 'array',
            description: 'Array of validation errors',
            items: {
              type: 'object',
              properties: {
                field: {
                  type: 'string',
                  description: 'Field name with error',
                  example: 'email',
                },
                message: {
                  type: 'string',
                  description: 'Error message for the field',
                  example: 'Invalid email format',
                },
              },
            },
            example: [
              {
                field: 'email',
                message: 'Invalid email format',
              },
            ],
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            description: 'Error timestamp',
            example: '2025-09-04T01:20:01.698Z',
          },
          path: {
            type: 'string',
            description: 'Request path',
            example: '/api/v1/users',
          },
        },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            description: 'Success message',
            example: 'User created successfully',
          },
          data: {
            type: 'object',
            description: 'Response data',
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            description: 'Response timestamp',
            example: '2025-09-04T01:20:01.698Z',
          },
          path: {
            type: 'string',
            description: 'Request path',
            example: '/api/v1/users',
          },
        },
        example: {
          success: true,
          message: 'User created successfully',
          data: {
            id: '507f1f77bcf86cd799439011',
            name: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            state: 'Active',
            createdAt: '2025-09-04T01:20:01.698Z',
            updatedAt: '2025-09-04T01:20:01.698Z',
          },
          timestamp: '2025-09-04T01:20:01.698Z',
          path: '/api/v1/users',
        },
      },
      HealthCheckResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Health check completed successfully',
          },
          data: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                enum: ['healthy', 'unhealthy'],
                example: 'healthy',
              },
              timestamp: {
                type: 'string',
                format: 'date-time',
                example: '2025-09-04T01:20:01.698Z',
              },
              uptime: {
                type: 'number',
                example: 1234.56,
              },
              version: {
                type: 'string',
                example: '1.0.0',
              },
              services: {
                type: 'object',
                properties: {
                  api: {
                    type: 'object',
                    properties: {
                      status: {
                        type: 'string',
                        example: 'healthy',
                      },
                      message: {
                        type: 'string',
                        example: 'API is running normally',
                      },
                    },
                  },
                  database: {
                    type: 'object',
                    properties: {
                      status: {
                        type: 'string',
                        example: 'healthy',
                      },
                      message: {
                        type: 'string',
                        example: 'Database connection is healthy',
                      },
                      responseTime: {
                        type: 'number',
                        example: 45,
                      },
                    },
                  },
                },
              },
            },
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2025-09-04T01:20:01.698Z',
          },
          path: {
            type: 'string',
            example: '/health',
          },
        },
      },
      AdvancedHealthCheckResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Advanced health check completed: healthy',
          },
          data: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                enum: ['healthy', 'unhealthy', 'degraded'],
                example: 'healthy',
              },
              timestamp: {
                type: 'string',
                format: 'date-time',
                example: '2025-09-04T01:20:01.698Z',
              },
              uptime: {
                type: 'number',
                example: 1234.56,
              },
              version: {
                type: 'string',
                example: '1.0.0',
              },
              environment: {
                type: 'string',
                example: 'development',
              },
              database: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    enum: ['connected', 'disconnected'],
                    example: 'connected',
                  },
                  responseTime: {
                    type: 'number',
                    example: 45,
                  },
                },
              },
              system: {
                type: 'object',
                properties: {
                  cpu: {
                    type: 'object',
                    properties: {
                      load: {
                        type: 'number',
                        example: 25.5,
                      },
                      cores: {
                        type: 'number',
                        example: 8,
                      },
                      model: {
                        type: 'string',
                        example: 'Intel Core i7',
                      },
                    },
                  },
                  memory: {
                    type: 'object',
                    properties: {
                      total: {
                        type: 'number',
                        example: 16777216,
                      },
                      used: {
                        type: 'number',
                        example: 8388608,
                      },
                      free: {
                        type: 'number',
                        example: 8388608,
                      },
                      percentage: {
                        type: 'number',
                        example: 50.0,
                      },
                    },
                  },
                  disk: {
                    type: 'object',
                    properties: {
                      total: {
                        type: 'number',
                        example: 1000000000000,
                      },
                      used: {
                        type: 'number',
                        example: 500000000000,
                      },
                      free: {
                        type: 'number',
                        example: 500000000000,
                      },
                      percentage: {
                        type: 'number',
                        example: 50.0,
                      },
                    },
                  },
                },
              },
            },
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2025-09-04T01:20:01.698Z',
          },
          path: {
            type: 'string',
            example: '/health/advanced',
          },
        },
      },
    },
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
      },
    },
  },
  security: [
    {
      ApiKeyAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [
    './src/presentation/controllers/*.ts',
    './src/presentation/routes/*.ts',
    './src/presentation/swagger/*.ts'
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
