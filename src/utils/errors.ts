import { Response } from 'express';
import { ApiError } from '../types';

export class AppError extends Error {
  constructor(
    public message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const sendError = (res: Response, error: AppError | Error) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.message,
      code: error.code,
    } as ApiError);
  }

  return res.status(500).json({
    error: 'Internal server error',
    code: 'INTERNAL_001',
  } as ApiError);
};

// Common error codes
export const ErrorCodes = {
  AUTH_001: 'Invalid token',
  AUTH_002: 'Token expired',
  AUTH_003: 'Invalid credentials',
  AUTH_004: 'Unauthorized',
  AUTH_005: 'Forbidden',
  VALIDATION_001: 'Validation error',
  NOT_FOUND_001: 'Resource not found',
  INTERNAL_001: 'Internal server error',
};

