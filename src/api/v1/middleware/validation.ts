import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpsConstants";
import { ObjectSchema } from "joi";
import { AppError } from "../utils/AppError";

export const validateBody = (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const {value, error} = schema.validate(body, {
        abortEarly: true,
        stripUnknown: true
    });

    if (error) {
      const customMessage = (error.details[0] as any)?.context?.message;
      const message = customMessage || error.details[0].message;

      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: `Validation error: ${message}`,
      });
    }

    req.body = value;
    next();
};

export const validateParams =
  (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    const { value, error } = schema.validate(req.params, {
      abortEarly: true,
      stripUnknown: true,
    });

    if (error) {
      const customMessage = (error.details[0] as any)?.context?.message;
      const message = customMessage || error.details[0].message;

      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: `Validation error: ${message}`,
      });
    }

    req.params = value;
    next();
  };

export const validateQuery = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,   
      stripUnknown: true,  
    });

    if (error) {
      next(
        new AppError(
          error.details.map((d) => d.message).join(", "),
          HTTP_STATUS.BAD_REQUEST
        )
      );
      return;
    }

    req.query = value;

    next();
  };
};