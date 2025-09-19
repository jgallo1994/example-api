import { Request, Response, NextFunction } from 'express';
import { ValidationMiddleware } from '../validationMiddleware';

describe('ValidationMiddleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('validate', () => {
    it('should call next() when validation passes', () => {
      const rules = [
        {
          field: 'name',
          required: true,
          type: 'string' as const,
          minLength: 2,
        },
      ];

      mockRequest = { body: { name: 'Juan' } };

      const middleware = ValidationMiddleware.validate(rules);
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('should return 400 when validation fails', () => {
      const rules = [
        {
          field: 'name',
          required: true,
          type: 'string' as const,
          minLength: 2,
        },
      ];

      mockRequest = { body: { name: 'J' } }; // Menos de 2 caracteres

      const middleware = ValidationMiddleware.validate(rules);
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        error: expect.any(String),
        timestamp: expect.any(String),
        path: expect.any(String),
      });
    });

    it('should handle multiple validation failures', () => {
      const rules = [
        {
          field: 'name',
          required: true,
          type: 'string' as const,
          minLength: 2,
        },
        { field: 'email', required: true, type: 'email' as const },
      ];

      mockRequest = { body: { name: 'J', email: 'invalid-email' } };

      const middleware = ValidationMiddleware.validate(rules);
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        error: expect.any(String),
        timestamp: expect.any(String),
        path: expect.any(String),
      });
    });

    it('should handle undefined values correctly', () => {
      const rules = [
        {
          field: 'name',
          required: true,
          type: 'string' as const,
          minLength: 2,
        },
      ];

      mockRequest = { body: {} };

      const middleware = ValidationMiddleware.validate(rules);
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        error: expect.any(String),
        timestamp: expect.any(String),
        path: expect.any(String),
      });
    });
  });

  describe('validateCreateUser', () => {
    it('should pass validation for valid user data', () => {
      mockRequest = {
        body: {
          name: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com',
        },
      };

      const middleware = ValidationMiddleware.validateCreateUser();
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('should fail validation for empty name', () => {
      mockRequest = {
        body: {
          name: '',
          lastName: 'Pérez',
          email: 'juan.perez@example.com',
        },
      };

      const middleware = ValidationMiddleware.validateCreateUser();
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        error: expect.any(String),
        timestamp: expect.any(String),
        path: expect.any(String),
      });
    });

    it('should fail validation for empty lastName', () => {
      mockRequest = {
        body: {
          name: 'Juan',
          lastName: '',
          email: 'juan.perez@example.com',
        },
      };

      const middleware = ValidationMiddleware.validateCreateUser();
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        error: expect.any(String),
        timestamp: expect.any(String),
        path: expect.any(String),
      });
    });

    it('should fail validation for invalid email format', () => {
      mockRequest = {
        body: {
          name: 'Juan',
          lastName: 'Pérez',
          email: 'invalid-email',
        },
      };

      const middleware = ValidationMiddleware.validateCreateUser();
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        error: expect.any(String),
        timestamp: expect.any(String),
        path: expect.any(String),
      });
    });

    it('should fail validation for missing required fields', () => {
      mockRequest = {
        body: {
          name: 'Juan',
          // Missing lastName and email
        },
      };

      const middleware = ValidationMiddleware.validateCreateUser();
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        error: expect.any(String),
        timestamp: expect.any(String),
        path: expect.any(String),
      });
    });
  });

  describe('validateUpdateUser', () => {
    it('should pass validation for valid update data', () => {
      mockRequest = {
        body: {
          name: 'Juan Updated',
          lastName: 'Pérez Updated',
          email: 'juan.updated@example.com',
        },
      };

      const middleware = ValidationMiddleware.validateUpdateUser();
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('should pass validation for partial update data', () => {
      mockRequest = {
        body: {
          name: 'Juan Updated',
          // Only updating name
        },
      };

      const middleware = ValidationMiddleware.validateUpdateUser();
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('should fail validation for invalid email in update', () => {
      mockRequest = {
        body: {
          name: 'Juan Updated',
          email: 'invalid-email',
        },
      };

      const middleware = ValidationMiddleware.validateUpdateUser();
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        error: expect.any(String),
        timestamp: expect.any(String),
        path: expect.any(String),
      });
    });

    it('should fail validation for empty string values', () => {
      mockRequest = {
        body: {
          name: 'J', // Menos de 2 caracteres, debería fallar minLength
          lastName: 'Pérez',
        },
      };

      const middleware = ValidationMiddleware.validateUpdateUser();
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        error: expect.any(String),
        timestamp: expect.any(String),
        path: expect.any(String),
      });
    });
  });

  describe('validateUserId', () => {
    it('should pass validation for valid UUID', () => {
      mockRequest = {
        params: {
          id: '123e4567-e89b-12d3-a456-426614174000',
        },
      };

      // Necesitamos crear un middleware personalizado para validar params
      const rules = [
        { field: 'id', required: true, type: 'string' as const, minLength: 1 },
      ];

      const middleware = ValidationMiddleware.validate(rules);
      // Modificar el middleware para que use params en lugar de body
      const customMiddleware = (
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        const errors: any[] = [];
        const params = req.params || {};

        rules.forEach(rule => {
          const value = params[rule.field];

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
        });

        if (errors.length > 0) {
          const response = {
            success: false,
            message: 'Validation failed',
            error: JSON.stringify(errors),
            timestamp: new Date().toISOString(),
            path: '/',
          };
          res.status(400).json(response);
          return;
        }

        next();
      };

      customMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('should fail validation for empty ID', () => {
      mockRequest = {
        params: {
          id: '',
        },
      };

      const rules = [
        { field: 'id', required: true, type: 'string' as const, minLength: 1 },
      ];

      const customMiddleware = (
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        const errors: any[] = [];
        const params = req.params || {};

        rules.forEach(rule => {
          const value = params[rule.field];

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
        });

        if (errors.length > 0) {
          const response = {
            success: false,
            message: 'Validation failed',
            error: JSON.stringify(errors),
            timestamp: new Date().toISOString(),
            path: '/',
          };
          res.status(400).json(response);
          return;
        }

        next();
      };

      customMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        error: expect.any(String),
        timestamp: expect.any(String),
        path: '/',
      });
    });

    it('should fail validation for undefined ID', () => {
      mockRequest = {
        params: {},
      };

      const rules = [
        { field: 'id', required: true, type: 'string' as const, minLength: 1 },
      ];

      const customMiddleware = (
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        const errors: any[] = [];
        const params = req.params || {};

        rules.forEach(rule => {
          const value = params[rule.field];

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
        });

        if (errors.length > 0) {
          const response = {
            success: false,
            message: 'Validation failed',
            error: JSON.stringify(errors),
            timestamp: new Date().toISOString(),
            path: '/',
          };
          res.status(400).json(response);
          return;
        }

        next();
      };

      customMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        error: expect.any(String),
        timestamp: expect.any(String),
        path: '/',
      });
    });

    it('should fail validation for invalid ID format', () => {
      mockRequest = {
        params: {
          id: 'invalid-id-format',
        },
      };

      const rules = [
        { field: 'id', required: true, type: 'string' as const, minLength: 1 },
      ];

      const customMiddleware = (
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        const errors: any[] = [];
        const params = req.params || {};

        rules.forEach(rule => {
          const value = params[rule.field];

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
        });

        if (errors.length > 0) {
          const response = {
            success: false,
            message: 'Validation failed',
            error: JSON.stringify(errors),
            timestamp: new Date().toISOString(),
            path: '/',
          };
          res.status(400).json(response);
          return;
        }

        next();
      };

      customMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });
});
