import { Request, Response, NextFunction } from 'express';
import { AppError, sendError } from '../utils/errors';

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  sendError(res, err);
};

export const notFoundHandler = (
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  res.status(404).json({
    error: 'Route not found',
    code: 'NOT_FOUND_001',
  });
};

