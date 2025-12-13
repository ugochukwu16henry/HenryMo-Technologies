// pages/api/analytics.js

import { verifyToken } from '../../lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function requireAdmin(req, res) {
  const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');
  const payload = verifyToken(token);

  if (!payload || !['ADMIN', 'SUPERADMIN'].includes(payload.role)) {
    res.status(403).json({ error: 'Admin access required.' });
    return false;
  }
  return true;
}

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;

  try {
    // Get all data for analytics
    // Handle cases where models might not exist in Prisma client yet
    let pages = [];
    let blogPosts = [];
    let portfolioItems = [];
    let inquiries = [];
    let scheduledPosts = [];
    let testimonials = [];
    let users = [];

    try {
      pages = await prisma.page.findMany();
    } catch (err) {
      console.error('Error fetching pages:', err.message);
    }

    try {
      blogPosts = await prisma.blogPost.findMany();
    } catch (err) {
      console.error('Error fetching blog posts:', err.message);
    }

    try {
      portfolioItems = await prisma.portfolioItem.findMany();
    } catch (err) {
      console.error('Error fetching portfolio items:', err.message);
    }

    try {
      inquiries = await prisma.inquiry.findMany();
    } catch (err) {
      console.error('Error fetching inquiries:', err.message);
    }

    try {
      scheduledPosts = await prisma.scheduledPost.findMany();
    } catch (err) {
      console.error('Error fetching scheduled posts:', err.message);
    }

    try {
      testimonials = await prisma.testimonial.findMany();
    } catch (err) {
      console.error('Error fetching testimonials:', err.message);
    }

    try {
      users = await prisma.user.findMany();
    } catch (err) {
      console.error('Error fetching users:', err.message);
    }

    // Calculate statistics
    const stats = {
      overview: {
        totalPages: pages.length,
        totalBlogPosts: blogPosts.length,
        publishedBlogPosts: blogPosts.filter(p => p.published).length,
        draftBlogPosts: blogPosts.filter(p => !p.published).length,
        totalPortfolioItems: portfolioItems.length,
        totalTestimonials: testimonials.length,
        featuredTestimonials: testimonials.filter(t => t.featured).length,
        totalUsers: users.length,
        adminUsers: users.filter(u => ['ADMIN', 'SUPERADMIN'].includes(u.role)).length,
      },
      inquiries: {
        total: inquiries.length,
        new: inquiries.filter(i => i.status === 'NEW').length,
        read: inquiries.filter(i => i.status === 'READ').length,
        inProgress: inquiries.filter(i => i.status === 'IN_PROGRESS').length,
        resolved: inquiries.filter(i => i.status === 'RESOLVED').length,
        recent: inquiries.slice(0, 5).map(i => ({
          id: i.id,
          name: i.name,
          email: i.email,
          status: i.status,
          createdAt: i.createdAt,
        })),
      },
      socialPosts: {
        total: scheduledPosts.length,
        scheduled: scheduledPosts.filter(p => p.status === 'SCHEDULED').length,
        posted: scheduledPosts.filter(p => p.status === 'POSTED').length,
        failed: scheduledPosts.filter(p => p.status === 'FAILED').length,
        draft: scheduledPosts.filter(p => p.status === 'DRAFT').length,
        byPlatform: scheduledPosts.reduce((acc, post) => {
          acc[post.platform] = (acc[post.platform] || 0) + 1;
          return acc;
        }, {}),
      },
      content: {
        blogCategories: blogPosts.reduce((acc, post) => {
          if (post.category) {
            acc[post.category] = (acc[post.category] || 0) + 1;
          }
          return acc;
        }, {}),
        recentBlogPosts: blogPosts.slice(0, 5).map(p => ({
          id: p.id,
          title: p.title,
          published: p.published,
          createdAt: p.createdAt,
        })),
        recentPages: pages.slice(0, 5).map(p => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          updatedAt: p.updatedAt,
        })),
      },
      timeline: {
        inquiriesLast30Days: getLast30DaysData(inquiries, 'createdAt'),
        blogPostsLast30Days: getLast30DaysData(blogPosts.filter(p => p.published), 'publishedAt'),
      },
    };

    return res.json(stats);
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: 'Failed to fetch analytics.' });
  } finally {
    await prisma.$disconnect();
  }
}

function getLast30DaysData(items, dateField) {
  const last30Days = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    
    const count = items.filter(item => {
      const itemDate = new Date(item[dateField] || item.createdAt);
      return itemDate >= date && itemDate < nextDate;
    }).length;
    
    last30Days.push({
      date: date.toISOString().split('T')[0],
      count,
    });
  }
  
  return last30Days;
}

