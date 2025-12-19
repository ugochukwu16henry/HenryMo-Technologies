// pages/api/analytics.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Check if PageView model exists
    let totalViews = 0;
    let uniqueVisitors = 0;
    let pagesTracked = 0;
    let topPages = [];
    let recentViews = [];
    let averageViewsPerDay = 0;

    try {
      // Total page views
      totalViews = await prisma.pageView.count({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      });

      // Unique visitors (estimated by unique visitorIds)
      const uniqueVisitorCount = await prisma.pageView.groupBy({
        by: ['visitorId'],
        where: {
          createdAt: {
            gte: startDate,
          },
          visitorId: {
            not: null,
          },
        },
      });
      uniqueVisitors = uniqueVisitorCount.length;

      // Top pages
      const topPagesData = await prisma.pageView.groupBy({
        by: ['page'],
        where: {
          createdAt: {
            gte: startDate,
          },
        },
        _count: {
          page: true,
        },
        orderBy: {
          _count: {
            page: 'desc',
          },
        },
        take: 10,
      });

      topPages = topPagesData.map((item) => ({
        page: item.page,
        count: item._count.page,
      }));

      // Count distinct pages
      const distinctPages = await prisma.pageView.groupBy({
        by: ['page'],
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      });
      pagesTracked = distinctPages.length;

      // Recent views
      recentViews = await prisma.pageView.findMany({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 20,
        select: {
          page: true,
          referrer: true,
          userAgent: true,
          createdAt: true,
        },
      });

      // Average views per day
      averageViewsPerDay = totalViews / days;
    } catch (dbError) {
      // PageView model doesn't exist yet - that's okay
      console.log('Analytics: PageView model not available yet');
    }

    return res.status(200).json({
      totalViews,
      uniqueVisitors,
      pagesTracked,
      topPages,
      recentViews,
      averageViewsPerDay,
      dateRange: days,
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return res.status(500).json({ error: 'Failed to fetch analytics' });
  } finally {
    await prisma.$disconnect();
  }
}
