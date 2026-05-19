import { AppError } from "../utils/AppError";
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err);

    if (err instanceof AppError) {
        res.status(err.statusCode).json({
        message: err.message,
        });
        return;
    }

    if (err.isJoi) {
    res.status(400).json({
        message: err.details[0].message,
    });
    return;
    }

    res.status(500).json({
        message: "Internal Server Error",
    });
};