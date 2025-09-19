import { Request, Response, NextFunction } from 'express';
import { logger } from '../../infrastructure/logging/Logger';

export const autoLoggingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();
  const { method, url, ip } = req;
  const userAgent = req.get('User-Agent') || 'Unknown';

  logger.info(`Incoming request: ${method} ${url}`, {
    method,
    url,
    ip,
    userAgent,
    timestamp: new Date().toISOString(),
  });

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const { statusCode } = res;

    if (statusCode >= 400) {
      logger.warn(`Request completed: ${method} ${url} - ${statusCode}`, {
        method,
        url,
        statusCode,
        duration: `${duration}ms`,
        ip,
        userAgent,
      });
    } else {
      logger.info(`Request completed: ${method} ${url} - ${statusCode}`, {
        method,
        url,
        statusCode,
        duration: `${duration}ms`,
        ip,
        userAgent,
      });
    }
  });

  next();
};
