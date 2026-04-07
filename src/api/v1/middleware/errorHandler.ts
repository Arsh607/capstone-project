import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpsConstants";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err); 

  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;

  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
  });
};