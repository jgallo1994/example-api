import { Request, Response, NextFunction } from 'express';
import { HttpResponse } from '../responses/HttpResponse';
import { UserEmail } from '../../domain/value-objects/UserEmail';

export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'email' | 'uuid';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => boolean;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

export class ValidationMiddleware {
  static validate(rules: ValidationRule[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const errors: ValidationError[] = [];
      const body = req.body || {};

      rules.forEach(rule => {
        const value = body[rule.field];

        if (
          rule.required &&
          (value === undefined || value === null || value === '')
        ) {
          errors.push({
            field: rule.field,
            message: `${rule.field} is required`,
            value,
          });
          return;
        }

        if (value === undefined || value === null || value === '') {
          return;
        }

        if (rule.type === 'string' && typeof value !== 'string') {
          errors.push({
            field: rule.field,
            message: `${rule.field} must be a string`,
            value,
          });
        }

        if (
          rule.minLength &&
          typeof value === 'string' &&
          value.length < rule.minLength
        ) {
          errors.push({
            field: rule.field,
            message: `${rule.field} must be at least ${rule.minLength} characters long`,
            value,
          });
        }

        if (
          rule.maxLength &&
          typeof value === 'string' &&
          value.length > rule.maxLength
        ) {
          errors.push({
            field: rule.field,
            message: `${rule.field} must not exceed ${rule.maxLength} characters`,
            value,
          });
        }

        if (
          rule.pattern &&
          typeof value === 'string' &&
          !rule.pattern.test(value)
        ) {
          errors.push({
            field: rule.field,
            message: `${rule.field} format is invalid`,
            value,
          });
        }

        if (rule.custom && !rule.custom(value)) {
          errors.push({
            field: rule.field,
            message: `${rule.field} validation failed`,
            value,
          });
        }
      });

      if (errors.length > 0) {
        const response = HttpResponse.validationError(
          'Validation failed',
          JSON.stringify(errors),
          req.path
        );
        res.status(400).json(response);
        return;
      }

      next();
    };
  }

  static validateCreateUser() {
    return this.validate([
      {
        field: 'name',
        required: true,
        type: 'string',
        minLength: 2,
        maxLength: 50,
      },
      {
        field: 'lastName',
        required: true,
        type: 'string',
        minLength: 2,
        maxLength: 50,
      },
      { field: 'email', required: true, type: 'email' },
      {
        field: 'email',
        custom: value => {
          try {
            new UserEmail(value as string);
            return true;
          } catch {
            return false;
          }
        },
      },
    ]);
  }

  static validateUpdateUser() {
    return this.validate([
      { field: 'name', type: 'string', minLength: 2, maxLength: 50 },
      { field: 'lastName', type: 'string', minLength: 2, maxLength: 50 },
      { field: 'email', type: 'email' },
      {
        field: 'email',
        custom: value => {
          try {
            new UserEmail(value as string);
            return true;
          } catch {
            return false;
          }
        },
      },
    ]);
  }

  static validateUserId() {
    return this.validate([
      { field: 'id', required: true, type: 'string', minLength: 1 },
    ]);
  }
}
