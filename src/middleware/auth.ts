import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { AppError, ErrorCodes } from '../utils/errors';
import { Role } from '../types';

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
    role: Role;
  };
}

export const authenticate = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', ErrorCodes.AUTH_001, 401);
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);
    
    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    next(new AppError('Invalid token', ErrorCodes.AUTH_001, 401));
  }
};

export const authorize = (...roles: Role[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Unauthorized', ErrorCodes.AUTH_004, 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Forbidden', ErrorCodes.AUTH_005, 403));
    }

    next();
  };
};

// Convenience middleware
export const requireAuth = authenticate;
export const requireAdmin = [authenticate, authorize(Role.ADMIN, Role.SUPERADMIN)];
export const requireSuperAdmin = [authenticate, authorize(Role.SUPERADMIN)];
export const requireClient = [authenticate, authorize(Role.CLIENT, Role.ADMIN, Role.SUPERADMIN)];
