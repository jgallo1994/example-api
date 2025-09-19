import { Request, Response, NextFunction } from 'express';
import { logger } from '../../infrastructure/logging/Logger';

export const requestLoggingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();
  const { method, url } = req;
  const userAgent = req.get('User-Agent') || 'Unknown';

  logger.info('Incoming request', {
    method,
    url,
    userAgent,
    timestamp: new Date().toISOString(),
  });

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const { statusCode } = res;

    logger.info('Request completed', {
      method,
      url,
      statusCode,
      duration,
      userAgent,
    });
  });

  next();
};

export const errorLoggingMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { method, url } = req;
  const userAgent = req.get('User-Agent') || 'Unknown';

  logger.error('Unhandled error occurred', {
    error: error.message,
    stack: error.stack,
    method,
    url,
    userAgent,
    timestamp: new Date().toISOString(),
  });

  next(error);
};
