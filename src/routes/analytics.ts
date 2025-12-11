import { Router } from 'express';
import { AuthRequest } from '../middleware/auth';
import { authenticate, requireAdmin } from '../middleware/auth';
import prisma from '../config/database';

const router = Router();

// GET /api/analytics/traffic
router.get('/traffic', ...requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    // Mock traffic data - in production, integrate with analytics service
    const traffic = {
      pageViews: 12500,
      uniqueVisitors: 8500,
      bounceRate: 45.2,
      avgSessionDuration: 180,
      topPages: [
        { path: '/', views: 3500 },
        { path: '/portfolio', views: 2800 },
        { path: '/services', views: 2200 },
      ],
    };

    res.json(traffic);
  } catch (error) {
    next(error);
  }
});

// GET /api/analytics/social/summary
router.get('/social/summary', ...requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const totalSchedules = await prisma.scheduledPost.count();
    const postedSchedules = await prisma.scheduledPost.count({
      where: { status: 'POSTED' },
    });

    const summary = {
      totalPosts: totalSchedules,
      postedPosts: postedSchedules,
      scheduledPosts: await prisma.scheduledPost.count({
        where: { status: 'SCHEDULED' },
      }),
      draftPosts: await prisma.scheduledPost.count({
        where: { status: 'DRAFT' },
      }),
      failedPosts: await prisma.scheduledPost.count({
        where: { status: 'FAILED' },
      }),
      platforms: await prisma.scheduledPost.groupBy({
        by: ['platform'],
        _count: true,
      }),
    };

    res.json(summary);
  } catch (error) {
    next(error);
  }
});

export default router;
