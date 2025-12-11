import { Router } from 'express';
import { AuthRequest } from '../middleware/auth';
import { authenticate, requireAdmin } from '../middleware/auth';
import { AppError, ErrorCodes } from '../utils/errors';
import { validate } from '../utils/validation';
import { z } from 'zod';
import prisma from '../config/database';

const router = Router();

const schedulePostSchema = z.object({
  platform: z.enum(['facebook', 'instagram', 'linkedin', 'twitter', 'tiktok', 'youtube']),
  content: z.string().min(1),
  mediaUrl: z.string().url().optional(),
  scheduledAt: z.string().datetime(),
  status: z.enum(['DRAFT', 'SCHEDULED', 'POSTED', 'FAILED']).optional(),
});

// POST /api/social/schedule
router.post('/schedule', ...requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', ErrorCodes.AUTH_004, 401);
    }

    const data = validate(schedulePostSchema, req.body);

    const schedule = await prisma.scheduledPost.create({
      data: {
        platform: data.platform,
        content: data.content,
        mediaUrl: data.mediaUrl,
        scheduledAt: new Date(data.scheduledAt),
        status: data.status || 'SCHEDULED',
        userId: req.user.userId,
      },
    });

    res.status(201).json(schedule);
  } catch (error) {
    next(error);
  }
});

// GET /api/social/schedule
router.get('/schedule', ...requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const status = req.query.status as string | undefined;
    const platform = req.query.platform as string | undefined;
    
    const schedules = await prisma.scheduledPost.findMany({
      where: {
        ...(status && { status: status as any }),
        ...(platform && { platform }),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: { scheduledAt: 'desc' },
    });

    res.json(schedules);
  } catch (error) {
    next(error);
  }
});

// GET /api/social/schedule/:id
router.get('/schedule/:id', ...requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    const schedule = await prisma.scheduledPost.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!schedule) {
      throw new AppError('Schedule not found', ErrorCodes.NOT_FOUND_001, 404);
    }

    res.json(schedule);
  } catch (error) {
    next(error);
  }
});

// PUT /api/social/schedule/:id
router.put('/schedule/:id', ...requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const data = validate(schedulePostSchema.partial(), req.body);

    const updateData: any = {};
    if (data.content) updateData.content = data.content;
    if (data.mediaUrl !== undefined) updateData.mediaUrl = data.mediaUrl;
    if (data.scheduledAt) updateData.scheduledAt = new Date(data.scheduledAt);
    if (data.status) updateData.status = data.status;
    if (data.platform) updateData.platform = data.platform;

    const schedule = await prisma.scheduledPost.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.json(schedule);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/social/schedule/:id
router.delete('/schedule/:id', ...requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    const schedule = await prisma.scheduledPost.findUnique({
      where: { id: parseInt(id) },
    });

    if (!schedule) {
      throw new AppError('Schedule not found', ErrorCodes.NOT_FOUND_001, 404);
    }

    if (schedule.status === 'POSTED') {
      throw new AppError('Cannot delete already posted schedule', ErrorCodes.VALIDATION_001, 400);
    }

    await prisma.scheduledPost.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
