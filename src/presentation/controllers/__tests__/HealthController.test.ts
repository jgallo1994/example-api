import { Request, Response } from 'express';
import { HealthController } from '../HealthController';
import { HealthCheckService } from '../../../infrastructure/health/HealthCheckService';
import { HttpResponse } from '../../responses/HttpResponse';

describe('HealthController', () => {
  let healthController: HealthController;
  let mockHealthCheckService: jest.Mocked<HealthCheckService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockHealthCheckService = {
      performHealthCheck: jest.fn(),
    } as any;

    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnThis();

    mockResponse = {
      json: mockJson,
      status: mockStatus,
    };

    healthController = new HealthController(mockHealthCheckService);
  });

  describe('getHealth', () => {
    it('should return healthy status when all services are up', async () => {
      mockRequest = { path: '/' };
      const healthyResponse = {
        status: 'healthy' as const,
        timestamp: new Date(),
        services: {
          api: {
            status: 'healthy' as const,
            message: 'API is running normally',
          },
          database: {
            status: 'healthy' as const,
            message: 'Database connection is healthy',
            responseTime: 5,
          },
        },
        uptime: 12345,
        version: '1.0.0',
      };
      mockHealthCheckService.performHealthCheck.mockResolvedValue(
        healthyResponse
      );

      await healthController.getHealth(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockHealthCheckService.performHealthCheck).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: 'Health check completed: healthy',
        data: healthyResponse,
        timestamp: expect.any(String),
        path: '/',
      });
    });

    it('should return unhealthy status when database is down', async () => {
      mockRequest = { path: '/' };
      const unhealthyResponse = {
        status: 'unhealthy' as const,
        timestamp: new Date(),
        services: {
          api: {
            status: 'healthy' as const,
            message: 'API is running normally',
          },
          database: {
            status: 'unhealthy' as const,
            message: 'Database connection failed: Connection timeout',
            responseTime: 5000,
          },
        },
        uptime: 12345,
        version: '1.0.0',
      };
      mockHealthCheckService.performHealthCheck.mockResolvedValue(
        unhealthyResponse
      );

      await healthController.getHealth(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockHealthCheckService.performHealthCheck).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(503);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: 'Health check completed: unhealthy',
        data: unhealthyResponse,
        timestamp: expect.any(String),
        path: '/',
      });
    });

    it('should handle service errors gracefully and return 500', async () => {
      const serviceError = new Error('Health check service unavailable');
      mockRequest = { path: '/' };
      mockHealthCheckService.performHealthCheck.mockRejectedValue(serviceError);

      await healthController.getHealth(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockHealthCheckService.performHealthCheck).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Health check failed',
        error: serviceError.message,
        timestamp: expect.any(String),
        path: '/',
      });
    });

    it('should handle partial service failures correctly', async () => {
      mockRequest = { path: '/' };
      const partialFailureResponse = {
        status: 'unhealthy' as const,
        timestamp: new Date(),
        services: {
          api: {
            status: 'healthy' as const,
            message: 'API is running normally',
          },
          database: {
            status: 'unhealthy' as const,
            message: 'Database connection failed: Service unavailable',
            responseTime: 150,
          },
        },
        uptime: 12345,
        version: '1.0.0',
      };
      mockHealthCheckService.performHealthCheck.mockResolvedValue(
        partialFailureResponse
      );

      await healthController.getHealth(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockHealthCheckService.performHealthCheck).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(503);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: 'Health check completed: unhealthy',
        data: partialFailureResponse,
        timestamp: expect.any(String),
        path: '/',
      });
    });

    it('should include proper error details in response', async () => {
      mockRequest = { path: '/' };
      const errorResponse = {
        status: 'unhealthy' as const,
        timestamp: new Date(),
        services: {
          api: {
            status: 'healthy' as const,
            message: 'API is running normally',
          },
          database: {
            status: 'unhealthy' as const,
            message: 'Database connection failed: MongoDB connection failed',
            responseTime: 5000,
          },
        },
        uptime: 12345,
        version: '1.0.0',
      };
      mockHealthCheckService.performHealthCheck.mockResolvedValue(
        errorResponse
      );

      await healthController.getHealth(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockHealthCheckService.performHealthCheck).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(503);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: 'Health check completed: unhealthy',
        data: errorResponse,
        timestamp: expect.any(String),
        path: '/',
      });
    });
  });
});
