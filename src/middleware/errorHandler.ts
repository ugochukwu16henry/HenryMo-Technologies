import { Request, Response, NextFunction } from 'express';
import { AppError, sendError } from '../utils/errors';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  sendError(res, err);
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(404).json({
    error: 'Route not found',
    code: 'NOT_FOUND_001',
  });
};

