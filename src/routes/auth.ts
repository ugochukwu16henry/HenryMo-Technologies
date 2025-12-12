import { Router } from 'express';
import { AuthRequest } from '../middleware/auth';
import { authenticate } from '../middleware/auth';
import { authRateLimiter } from '../middleware/rateLimiter';
import { validate } from '../utils/validation';
import {
  loginSchema,
  registerSchema,
} from '../utils/validation';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken } from '../utils/jwt';
import { AppError, ErrorCodes } from '../utils/errors';
import prisma from '../config/database';

const router = Router();

// POST /api/auth/login
router.post('/login', authRateLimiter, async (req, res, next) => {
  try {
    const validated = validate(loginSchema, req.body);
    const { email, password } = validated;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await comparePassword(password, user.password))) {
      throw new AppError('Invalid credentials', ErrorCodes.AUTH_003, 401);
    }

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role as string,
    };

    const accessToken = generateAccessToken(payload);

    res.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/register
router.post('/register', authRateLimiter, async (req, res, next) => {
  try {
    const validated = validate(registerSchema, req.body);
    const { email, password, name } = validated;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('User already exists', ErrorCodes.VALIDATION_001, 409);
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'USER',
      },
    });

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role as string,
    };

    const accessToken = generateAccessToken(payload);

    res.status(201).json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/logout
router.post('/logout', authenticate, async (_req: AuthRequest, res, next) => {
  try {
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
