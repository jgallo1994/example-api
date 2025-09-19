import { inject, injectable } from 'inversify';
import { logger } from '../logging/Logger';
import { TYPES } from '../di/types';
import { MongoConnection } from '../database/MongoConnection';

export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy';
  timestamp: Date;
  services: {
    api: {
      status: 'healthy' | 'unhealthy';
      message: string;
    };
    database: {
      status: 'healthy' | 'unhealthy';
      message: string;
      responseTime?: number;
    };
  };
  uptime: number;
  version: string;
}

@injectable()
export class HealthCheckService {
  constructor(
    @inject(TYPES.MongoConnection) private mongoConnection: MongoConnection
  ) {}

  async performHealthCheck(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    const uptime = process.uptime();

    try {
      const apiHealth = {
        status: 'healthy' as const,
        message: 'API is running normally',
      };

      const dbStartTime = Date.now();
      let dbHealth;

      try {
        const db = this.mongoConnection.getDatabase();
        await db.admin().ping();
        const dbResponseTime = Date.now() - dbStartTime;

        dbHealth = {
          status: 'healthy' as const,
          message: 'Database connection is healthy',
          responseTime: dbResponseTime,
        };

        logger.debug('Database health check successful', {
          responseTime: dbResponseTime,
        });
      } catch (dbError) {
        const dbResponseTime = Date.now() - dbStartTime;
        const errorMessage =
          dbError instanceof Error ? dbError.message : String(dbError);

        dbHealth = {
          status: 'unhealthy' as const,
          message: `Database connection failed: ${errorMessage}`,
          responseTime: dbResponseTime,
        };

        logger.error('Database health check failed', {
          error: errorMessage,
          responseTime: dbResponseTime,
        });
      }

      const overallStatus =
        apiHealth.status === 'healthy' && dbHealth.status === 'healthy'
          ? 'healthy'
          : 'unhealthy';

      const result: HealthCheckResult = {
        status: overallStatus,
        timestamp: new Date(),
        services: {
          api: apiHealth,
          database: dbHealth,
        },
        uptime,
        version: process.env.npm_package_version || '1.0.0',
      };

      const totalResponseTime = Date.now() - startTime;
      logger.info('Health check completed', {
        status: overallStatus,
        responseTime: totalResponseTime,
        dbStatus: dbHealth.status,
      });

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error('Health check failed', { error: errorMessage });

      return {
        status: 'unhealthy',
        timestamp: new Date(),
        services: {
          api: {
            status: 'unhealthy',
            message: `Health check failed: ${errorMessage}`,
          },
          database: {
            status: 'unhealthy',
            message: 'Database check could not be performed',
          },
        },
        uptime,
        version: process.env.npm_package_version || '1.0.0',
      };
    }
  }
}
