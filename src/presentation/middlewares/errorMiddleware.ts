import { Request, Response } from 'express';
import { logger } from '../../infrastructure/logging/Logger';
import { HttpResponse } from '../responses/HttpResponse';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  isOperational?: boolean;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response
): void => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  logger.error(`Error ${statusCode}: ${message}`, {
    error: {
      name: error.name,
      message: error.message,
      code: error.code,
      isOperational: error.isOperational,
      stack: error.stack,
    },
    request: {
      method: req.method,
      url: req.url,
      userAgent: req.get('User-Agent'),
    },
  });

  const response = HttpResponse.error(
    message,
    process.env.NODE_ENV === 'development' ? error.stack : undefined,
    req.path
  );

  res.status(statusCode).json(response);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`, {
    request: {
      method: req.method,
      url: req.url,
      userAgent: req.get('User-Agent'),
    },
  });

  const response = HttpResponse.notFound(
    `Route ${req.originalUrl} not found`,
    req.path
  );

  res.status(404).json(response);
};
