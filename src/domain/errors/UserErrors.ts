import { DomainError } from './DomainError';

export class UserNotFoundError extends DomainError {
  constructor(userId: string) {
    super(`User with ID '${userId}' not found`, 'USER_NOT_FOUND', 404, true);
  }
}

export class UserEmailAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super(
      `User with email '${email}' already exists`,
      'USER_EMAIL_ALREADY_EXISTS',
      409,
      true
    );
  }
}

export class UserValidationError extends DomainError {
  constructor(field: string, reason: string) {
    super(
      `User validation failed for field '${field}': ${reason}`,
      'USER_VALIDATION_ERROR',
      400,
      true
    );
  }
}

export class UserOperationError extends DomainError {
  constructor(operation: string, reason: string) {
    super(
      `User operation '${operation}' failed: ${reason}`,
      'USER_OPERATION_ERROR',
      500,
      true
    );
  }
}
