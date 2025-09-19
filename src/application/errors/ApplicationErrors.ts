import { ApplicationErrorBase } from './ApplicationErrorBase';

export class UseCaseError extends ApplicationErrorBase {
  constructor(useCase: string, reason: string) {
    super(
      `Use case '${useCase}' failed: ${reason}`,
      'USE_CASE_ERROR',
      400,
      true
    );
  }
}

export class ValidationError extends ApplicationErrorBase {
  constructor(field: string, reason: string) {
    super(
      `Validation failed for field '${field}': ${reason}`,
      'VALIDATION_ERROR',
      400,
      true
    );
  }
}

export class BusinessRuleViolationError extends ApplicationErrorBase {
  constructor(rule: string, reason: string) {
    super(
      `Business rule '${rule}' violated: ${reason}`,
      'BUSINESS_RULE_VIOLATION_ERROR',
      400,
      true
    );
  }
}

export class UnauthorizedError extends ApplicationErrorBase {
  constructor(action: string, reason: string) {
    super(
      `Unauthorized to perform '${action}': ${reason}`,
      'UNAUTHORIZED_ERROR',
      401,
      true
    );
  }
}

export class ForbiddenError extends ApplicationErrorBase {
  constructor(action: string, reason: string) {
    super(
      `Forbidden to perform '${action}': ${reason}`,
      'FORBIDDEN_ERROR',
      403,
      true
    );
  }
}
