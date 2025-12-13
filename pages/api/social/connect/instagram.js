// pages/api/social/connect/instagram.js

import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../../../lib/auth';

const prisma = new PrismaClient();

const CLIENT_ID = process.env.INSTAGRAM_APP_ID;
const CLIENT_SECRET = process.env.INSTAGRAM_APP_SECRET;
const REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI;

export default async function handler(req, res) {
  const { code } = req.query;

  // Get authenticated user ID from token
  let userId = 1; // Default fallback
  const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');
  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      userId = payload.id;
    }
  }

  if (code) {
    try {
      // Exchange code for access token
      const tokenRes = await fetch(`https://api.instagram.com/oauth/access_token`, {
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
        throw new Error('Failed to get Instagram access token');
      }

      const accessToken = tokenData.access_token;
      const expiresIn = tokenData.expires_in || 5184000; // Default 60 days

      // Get user info
      const userRes = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`);
      const userInfo = await userRes.json();

      // Store token
      await prisma.socialAccount.upsert({
        where: { platform_userId: { platform: 'instagram', userId } },
        update: {
          accessToken,
          expiresAt: new Date(Date.now() + expiresIn * 1000),
          metadata: JSON.stringify(userInfo || {}),
        },
        create: {
          platform: 'instagram',
          userId,
          accessToken,
          expiresAt: new Date(Date.now() + expiresIn * 1000),
          metadata: JSON.stringify(userInfo || {}),
        },
      });

      return res.redirect('/admin/social-accounts?social=instagram-connected');
    } catch (err) {
      console.error('Instagram OAuth error:', err);
      return res.status(500).json({ error: 'Instagram connection failed' });
    } finally {
      await prisma.$disconnect();
    }
  }

  // Redirect to Instagram auth
  const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=user_profile,user_media&response_type=code`;
  res.redirect(authUrl);
}

