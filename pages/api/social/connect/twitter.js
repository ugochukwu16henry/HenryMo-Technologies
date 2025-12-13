// pages/api/social/connect/twitter.js

import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../../../lib/auth';

const prisma = new PrismaClient();

const CLIENT_ID = process.env.TWITTER_CLIENT_ID;
const CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET;
const REDIRECT_URI = process.env.TWITTER_REDIRECT_URI;

export default async function handler(req, res) {
  const { code, state } = req.query;

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
      // Exchange code for access token (Twitter uses OAuth 2.0)
      const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
      
      const tokenRes = await fetch('https://api.twitter.com/2/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${credentials}`,
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: REDIRECT_URI,
          code_verifier: state, // In production, store this securely
        }),
      });

      const tokenData = await tokenRes.json();
      if (!tokenData.access_token) {
        throw new Error('Failed to get Twitter access token');
      }

      const accessToken = tokenData.access_token;
      const expiresIn = tokenData.expires_in || 7200; // Default 2 hours

      // Get user info
      const userRes = await fetch('https://api.twitter.com/2/users/me', {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      const userInfo = await userRes.json();

      // Store token
      await prisma.socialAccount.upsert({
        where: { platform_userId: { platform: 'twitter', userId } },
        update: {
          accessToken,
          expiresAt: new Date(Date.now() + expiresIn * 1000),
          metadata: JSON.stringify(userInfo || {}),
        },
        create: {
          platform: 'twitter',
          userId,
          accessToken,
          expiresAt: new Date(Date.now() + expiresIn * 1000),
          metadata: JSON.stringify(userInfo || {}),
        },
      });

      return res.redirect('/admin/social-accounts?social=twitter-connected');
    } catch (err) {
      console.error('Twitter OAuth error:', err);
      return res.status(500).json({ error: 'Twitter connection failed' });
    } finally {
      await prisma.$disconnect();
    }
  }

  // Redirect to Twitter auth (OAuth 2.0)
  const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=tweet.read%20tweet.write%20users.read&state=random_state_string`;
  res.redirect(authUrl);
}

