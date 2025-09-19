export interface DatabaseConfig {
  uri: string;
  name: string;
  options: {
    maxPoolSize: number;
    serverSelectionTimeoutMS: number;
    socketTimeoutMS: number;
  };
}

export interface ServerConfig {
  port: number;
  host: string;
  cors: {
    origin: string | string[];
    credentials: boolean;
  };
}

export interface LoggingConfig {
  level: string;
  enableConsole: boolean;
  enableFile: boolean;
  filePath: string;
  maxSize: string;
  maxFiles: string;
}

export interface AppConfig {
  environment: string;
  database: DatabaseConfig;
  server: ServerConfig;
  logging: LoggingConfig;
}

export const appConfig: AppConfig = {
  environment: process.env.NODE_ENV || 'development',

  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    name: process.env.MONGODB_DB_NAME || 'example-api',
    options: {
      maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE || '10'),
      serverSelectionTimeoutMS: parseInt(
        process.env.MONGODB_SERVER_SELECTION_TIMEOUT || '5000'
      ),
      socketTimeoutMS: parseInt(process.env.MONGODB_SOCKET_TIMEOUT || '45000'),
    },
  },

  server: {
    port: parseInt(process.env.PORT || '3000'),
    host: process.env.HOST || '0.0.0.0',
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      credentials: process.env.CORS_CREDENTIALS === 'true',
    },
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
    enableConsole: process.env.LOG_ENABLE_CONSOLE !== 'false',
    enableFile: process.env.LOG_ENABLE_FILE !== 'false',
    filePath: process.env.LOG_FILE_PATH || 'logs/application-%DATE%.log',
    maxSize: process.env.LOG_MAX_SIZE || '20m',
    maxFiles: process.env.LOG_MAX_FILES || '14d',
  },
};
