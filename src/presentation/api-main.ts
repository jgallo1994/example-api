import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { container } from '../infrastructure/di/container';
import { TYPES } from '../infrastructure/di/types';
import { MongoConnection } from '../infrastructure/database/MongoConnection';
import { UserController } from './controllers/UserController';
import { HealthController } from './controllers/HealthController';
import { AdvancedHealthController } from './controllers/AdvancedHealthController';
import { createUserRoutes } from './routes/UserRoutes';
import { createHealthRoutes } from './routes/HealthRoutes';
import { autoLoggingMiddleware } from './middlewares/autoLoggingMiddleware';
import { errorHandler, notFoundHandler } from './middlewares/errorMiddleware';
import {
  securityMiddleware,
  rateLimitMiddleware,
} from './middlewares/securityMiddleware';
import { compressionMiddleware } from './middlewares/compressionMiddleware';
import { logger } from '../infrastructure/logging/Logger';
import { appConfig } from '../infrastructure/config/AppConfig';
import { swaggerSpec } from './swagger/swaggerConfig';

dotenv.config();

const app = express();

app.use(securityMiddleware);
app.use(compressionMiddleware);
app.use(cors(appConfig.server.cors));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(autoLoggingMiddleware);
app.use(rateLimitMiddleware);

async function startServer() {
  try {
    const mongoConnection = container.get<MongoConnection>(
      TYPES.MongoConnection
    );
    await mongoConnection.connect();
    logger.info('Connected to MongoDB successfully');

    const userController = container.get<UserController>(TYPES.UserController);
    const healthController = container.get<HealthController>(
      TYPES.HealthController
    );
    const advancedHealthController = container.get<AdvancedHealthController>(
      TYPES.AdvancedHealthController
    );

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
      swaggerOptions: {
        docExpansion: 'list',
        filter: true,
        showRequestHeaders: true,
        showCommonExtensions: true,
        tryItOutEnabled: true,
        requestInterceptor: (req: any) => {
          // Enable CORS for Swagger UI requests
          req.headers['Access-Control-Allow-Origin'] = '*';
          return req;
        },
        responseInterceptor: (res: any) => {
          // Log responses for debugging
          console.log('Swagger Response:', res);
          return res;
        },
      },
      customCss: `
        .swagger-ui .topbar { display: none }
        .swagger-ui .info .title { font-size: 2.5em; }
        .swagger-ui .info .description { font-size: 1.1em; margin: 1em 0; }
        .swagger-ui .scheme-container { margin: 1em 0; }
        .swagger-ui .try-out__btn { background-color: #4990e2; }
        .swagger-ui .try-out__btn:hover { background-color: #357abd; }
      `,
      customSiteTitle: 'Example API Documentation',
      customfavIcon: '/favicon.ico',
    }));
    app.use(
      '/',
      createHealthRoutes(healthController, advancedHealthController)
    );
    app.use('/api/v1/users', createUserRoutes(userController));

    app.use(notFoundHandler);
    app.use(errorHandler);

    app.listen(appConfig.server.port, appConfig.server.host, () => {
      logger.info(
        `Server is running on ${appConfig.server.host}:${appConfig.server.port}`,
        {
          environment: appConfig.environment,
          port: appConfig.server.port,
          host: appConfig.server.host,
        }
      );
      logger.info(
        `Health check available at: http://${appConfig.server.host}:${appConfig.server.port}/health`
      );
      logger.info(
        `API v1 available at: http://${appConfig.server.host}:${appConfig.server.port}/api/v1`
      );
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('Failed to start server', { error: errorMessage });
    process.exit(1);
  }
}

startServer();

process.on('SIGINT', async () => {
  try {
    const mongoConnection = container.get<MongoConnection>(
      TYPES.MongoConnection
    );
    await mongoConnection.disconnect();
    logger.info('Server shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown', { error });
    process.exit(1);
  }
});
