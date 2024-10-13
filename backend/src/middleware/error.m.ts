import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { CustomError } from '../utils/customError';

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // console.log(err)
  if (err instanceof CustomError) {
    const { statusCode, message, logging, error } = err;
    res.status(statusCode).json({
      msg: message,
      statusCode,
      data: [],
    });
    return
  }

  res.status(500).json({
    msg: "Internal Server Error",
    statusCode: 500,
    data: [],
  });
  return
};
