import { Router } from 'express';
import { AuthRequest } from '../middleware/auth';
import { authenticate, requireAdmin } from '../middleware/auth';
import { AppError, ErrorCodes } from '../utils/errors';
import { validate } from '../utils/validation';
import { z } from 'zod';
import prisma from '../config/database';

const router = Router();

const updateProfileSchema = z.object({
  name: z.string().optional(),
});

// GET /api/users/me
router.get('/me', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', ErrorCodes.AUTH_004, 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', ErrorCodes.NOT_FOUND_001, 404);
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// PUT /api/users/me
router.put('/me', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', ErrorCodes.AUTH_004, 401);
    }

    const data = validate(updateProfileSchema, req.body);

    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// GET /api/users/team
router.get('/team', ...requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: {
          in: ['ADMIN', 'SUPERADMIN'],
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(users);
  } catch (error) {
    next(error);
  }
});

export default router;
