import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export interface ValidationSchema {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}

export const validateRequest = (schema: ValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const validationOptions = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    };

    const { error, value } = Joi.object({
      body: schema.body || Joi.any(),
      query: schema.query || Joi.any(),
      params: schema.params || Joi.any(),
    }).validate(
      {
        body: req.body,
        query: req.query,
        params: req.params,
      },
      validationOptions
    );

    if (error) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
        })),
      });
      return;
    }

    req.body = value.body;
    req.query = value.query;
    req.params = value.params;
    next();
  };
};

export const userValidationSchemas = {
  createUser: {
    body: Joi.object({
      name: Joi.string().min(2).max(50).required(),
      lastName: Joi.string().min(2).max(50).required(),
      email: Joi.string().email().required(),
    }),
  },
  updateUser: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
    body: Joi.object({
      name: Joi.string().min(2).max(50).optional(),
      lastName: Joi.string().min(2).max(50).optional(),
      email: Joi.string().email().optional(),
    }),
  },
  getUser: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },
  deleteUser: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },
};
