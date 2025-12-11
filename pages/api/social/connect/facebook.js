// pages/api/social/connect/facebook.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CLIENT_ID = process.env.FACEBOOK_APP_ID;
const CLIENT_SECRET = process.env.FACEBOOK_APP_SECRET;
const REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI;

export default async function handler(req, res) {
  const { code } = req.query;

  if (code) {
    try {
      // Exchange code for access token
      const tokenRes = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: REDIRECT_URI,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
        }),
      });

      const tokenData = await tokenRes.json();
      if (!tokenData.access_token) {
        throw new Error('Failed to get Facebook access token');
      }

      const accessToken = tokenData.access_token;
      const expiresIn = tokenData.expires_in || 5184000; // Default 60 days

      // Get page info
      const pageRes = await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`);
      const pageData = await pageRes.json();
      const pageInfo = pageData.data?.[0];

      // Store token (assume user ID = 1 for MVP)
      await prisma.socialAccount.upsert({
        where: { platform_userId: { platform: 'facebook', userId: 1 } },
        update: {
          accessToken,
          expiresAt: new Date(Date.now() + expiresIn * 1000),
          metadata: JSON.stringify(pageInfo || {}),
        },
        create: {
          platform: 'facebook',
          userId: 1,
          accessToken,
          expiresAt: new Date(Date.now() + expiresIn * 1000),
          metadata: JSON.stringify(pageInfo || {}),
        },
      });

      return res.redirect('/admin?social=facebook-connected');
    } catch (err) {
      console.error('Facebook OAuth error:', err);
      return res.status(500).json({ error: 'Facebook connection failed' });
    } finally {
      await prisma.$disconnect();
    }
  }

  // Redirect to Facebook auth
  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=pages_manage_posts,pages_read_engagement`;
  res.redirect(authUrl);
}

