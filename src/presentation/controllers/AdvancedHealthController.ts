import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { AdvancedHealthCheckService } from '../../infrastructure/health/AdvancedHealthCheckService';
import { TYPES } from '../../infrastructure/di/types';
import { HttpResponse } from '../responses/HttpResponse';

@injectable()
export class AdvancedHealthController {
  constructor(
    @inject(TYPES.AdvancedHealthCheckService)
    private advancedHealthCheckService: AdvancedHealthCheckService
  ) {}

  async getAdvancedHealth(req: Request, res: Response): Promise<void> {
    try {
      const healthResult =
        await this.advancedHealthCheckService.performAdvancedHealthCheck();

      const statusCode = this.getStatusCode(healthResult.status);
      const response = HttpResponse.success(
        healthResult,
        `Advanced health check completed: ${healthResult.status}`,
        req.path
      );

      res.status(statusCode).json(response);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const response = HttpResponse.error(
        'Advanced health check failed',
        errorMessage,
        req.path
      );
      res.status(500).json(response);
    }
  }

  private getStatusCode(status: string): number {
    switch (status) {
      case 'healthy':
        return 200;
      case 'degraded':
        return 200;
      case 'unhealthy':
        return 503;
      default:
        return 500;
    }
  }
}
