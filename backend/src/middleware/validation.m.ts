import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

export function validationMiddleware(schema: Joi.Schema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const validationOptions = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    };
    try {
      req.body = await schema.validateAsync({ ...req.body }, validationOptions);
      next();
    } catch (e: any) {
      const errors: any[] = [];
      e.details.forEach((error: Joi.ValidationErrorItem) => {
        errors.push({ message: error.message.replace(/\\"|"/g, ''), path: error.path[0] });
      });
      res.status(400).json({
        msg: "Bad Request",
        statusCode: 400,
        data: errors,
      });
    }
  };
}
