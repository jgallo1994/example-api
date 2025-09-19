import { InfrastructureErrorBase } from './InfrastructureErrorBase';

export class DatabaseConnectionError extends InfrastructureErrorBase {
  constructor(database: string, reason: string) {
    super(
      `Failed to connect to database '${database}': ${reason}`,
      'DATABASE_CONNECTION_ERROR',
      500,
      false
    );
  }
}

export class DatabaseOperationError extends InfrastructureErrorBase {
  constructor(operation: string, collection: string, reason: string) {
    super(
      `Database operation '${operation}' failed on collection '${collection}': ${reason}`,
      'DATABASE_OPERATION_ERROR',
      500,
      false
    );
  }
}

export class RepositoryError extends InfrastructureErrorBase {
  constructor(repository: string, operation: string, reason: string) {
    super(
      `Repository '${repository}' operation '${operation}' failed: ${reason}`,
      'REPOSITORY_ERROR',
      500,
      false
    );
  }
}

export class ExternalServiceError extends InfrastructureErrorBase {
  constructor(service: string, operation: string, reason: string) {
    super(
      `External service '${service}' operation '${operation}' failed: ${reason}`,
      'EXTERNAL_SERVICE_ERROR',
      502,
      false
    );
  }
}
