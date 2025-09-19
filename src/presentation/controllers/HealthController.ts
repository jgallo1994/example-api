import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { HealthCheckService } from '../../infrastructure/health/HealthCheckService';
import { TYPES } from '../../infrastructure/di/types';
import { HttpResponse } from '../responses/HttpResponse';

@injectable()
export class HealthController {
  constructor(
    @inject(TYPES.HealthCheckService)
    private healthCheckService: HealthCheckService
  ) {}

  async getHealth(req: Request, res: Response): Promise<void> {
    try {
      const healthResult = await this.healthCheckService.performHealthCheck();

      const statusCode = healthResult.status === 'healthy' ? 200 : 503;
      const response = HttpResponse.success(
        healthResult,
        `Health check completed: ${healthResult.status}`,
        req.path
      );

      res.status(statusCode).json(response);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const response = HttpResponse.error(
        'Health check failed',
        errorMessage,
        req.path
      );
      res.status(500).json(response);
    }
  }
}
