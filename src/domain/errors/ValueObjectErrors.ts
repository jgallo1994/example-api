import { DomainError } from './DomainError';

export class ValueObjectValidationError extends DomainError {
  constructor(valueObjectName: string, field: string, reason: string) {
    super(
      `${valueObjectName} validation failed for field '${field}': ${reason}`,
      'VALUE_OBJECT_VALIDATION_ERROR',
      400,
      true
    );
  }
}

export class InvalidEmailFormatError extends DomainError {
  constructor(email: string) {
    super(
      `Invalid email format: '${email}'`,
      'INVALID_EMAIL_FORMAT',
      400,
      true
    );
  }
}

export class InvalidNameLengthError extends DomainError {
  constructor(
    fieldName: string,
    minLength: number,
    maxLength: number,
    actualLength: number
  ) {
    super(
      `${fieldName} length must be between ${minLength} and ${maxLength} characters. Current length: ${actualLength}`,
      'INVALID_NAME_LENGTH',
      400,
      true
    );
  }
}

export class EmptyValueError extends DomainError {
  constructor(fieldName: string) {
    super(`${fieldName} cannot be empty`, 'EMPTY_VALUE_ERROR', 400, true);
  }
}
