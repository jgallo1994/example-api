import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  VERBOSE = 'verbose',
}

export interface LogContext {
  [key: string]: unknown;
}

export class Logger {
  private logger!: winston.Logger;
  private isDevelopment: boolean;
  private isTestEnvironment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.isTestEnvironment =
      process.env.NODE_ENV === 'test' ||
      process.env.JEST_WORKER_ID !== undefined;
    this.initializeLogger();
  }

  private initializeLogger(): void {
    const logFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    );

    const consoleFormat = winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
      })
    );

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: logFormat,
      transports: [
        new winston.transports.Console({
          format: consoleFormat,
        }),
        new DailyRotateFile({
          filename: 'logs/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
      ],
    });
  }

  error(message: string, context?: LogContext): void {
    if (this.isTestEnvironment) return;
    this.logger.error(message, context);
  }

  warn(message: string, context?: LogContext): void {
    if (this.isTestEnvironment) return;
    this.logger.warn(message, context);
  }

  info(message: string, context?: LogContext): void {
    if (this.isTestEnvironment) return;
    this.logger.info(message, context);
  }

  debug(message: string, context?: LogContext): void {
    if (this.isTestEnvironment) return;
    if (this.isDevelopment) {
      this.logger.debug(message, context);
    }
  }

  verbose(message: string, context?: LogContext): void {
    if (this.isTestEnvironment) return;
    if (this.isDevelopment) {
      this.logger.verbose(message, context);
    }
  }

  logHttpRequest(
    method: string,
    url: string,
    statusCode: number,
    responseTime: number,
    userAgent?: string
  ): void {
    if (this.isTestEnvironment) return;
    const context: LogContext = {
      method,
      url,
      statusCode,
      responseTime: `${responseTime}ms`,
      userAgent,
    };

    if (statusCode >= 400) {
      this.warn(`HTTP ${method} ${url} - ${statusCode}`, context);
    } else {
      this.info(`HTTP ${method} ${url} - ${statusCode}`, context);
    }
  }

  logDatabaseOperation(
    operation: string,
    collection: string,
    duration: number,
    success: boolean,
    error?: unknown
  ): void {
    if (this.isTestEnvironment) return;
    const context: LogContext = {
      operation,
      collection,
      duration: `${duration}ms`,
      success,
    };

    if (error) {
      context.error = error instanceof Error ? error.message : String(error);
    }

    if (success) {
      this.debug(`Database operation: ${operation} on ${collection}`, context);
    } else {
      this.error(
        `Database operation failed: ${operation} on ${collection}`,
        context
      );
    }
  }

  logUseCaseExecution(
    useCase: string,
    duration: number,
    success: boolean,
    error?: unknown
  ): void {
    if (this.isTestEnvironment) return;
    const context: LogContext = {
      useCase,
      duration: `${duration}ms`,
      success,
    };

    if (error) {
      context.error = error instanceof Error ? error.message : String(error);
    }

    if (success) {
      this.info(`Use case executed: ${useCase}`, context);
    } else {
      this.error(`Use case failed: ${useCase}`, context);
    }
  }

  getWinstonLogger(): winston.Logger {
    return this.logger;
  }
}

export const logger = new Logger();
