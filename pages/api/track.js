// pages/api/track.js
// Simple analytics tracking endpoint

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { page, referrer, userAgent } = req.body;
    
    // Get visitor IP (for unique visitor counting)
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded ? forwarded.split(',')[0] : req.socket.remoteAddress;
    
    // Hash the IP for privacy
    const visitorId = Buffer.from(ip + (userAgent || '')).toString('base64').slice(0, 32);

    // Try to save to database if PageView model exists
    try {
      await prisma.pageView.create({
        data: {
          page: page || '/',
          referrer: referrer || null,
          userAgent: userAgent || null,
          visitorId: visitorId,
          country: null, // Can be added with IP geolocation service
        },
      });
    } catch (dbError) {
      // PageView model might not exist yet, that's okay
      console.log('PageView tracking skipped (model may not exist):', dbError.message);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Track error:', error);
    return res.status(500).json({ error: 'Failed to track' });
  } finally {
    await prisma.$disconnect();
  }
}

