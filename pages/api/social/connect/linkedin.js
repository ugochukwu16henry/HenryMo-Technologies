// pages/api/social/connect/linkedin.js

import { PrismaClient } from '@prisma/client';



const prisma = new PrismaClient();



const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;

const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;

const REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI; // e.g. https://henrymo.vercel.app/api/social/connect/linkedin



export default async function handler(req, res) {

  const { code } = req.query;



  // Step 1: User is redirected here after approving LinkedIn auth

  if (code) {

    try {

      // Step 2: Exchange code for access token

      const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {

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

        throw new Error('Failed to get LinkedIn access token');

      }



      const accessToken = tokenData.access_token;

      const expiresIn = tokenData.expires_in;



      // Optional: Get user/org info

      const userRes = await fetch('https://api.linkedin.com/v2/userinfo', {

        headers: { Authorization: `Bearer ${accessToken}` }

      });

      const userInfo = await userRes.json();



      // Step 3: Store token securely in DB (encrypted in production)

      // For MVP: associate with admin user (assume user ID = 1)

      await prisma.socialAccount.upsert({

        where: { platform_userId: { platform: 'linkedin', userId: 1 } },

        update: { accessToken, expiresAt: new Date(Date.now() + expiresIn * 1000) },

        create: {

          platform: 'linkedin',

          userId: 1,

          accessToken,

          expiresAt: new Date(Date.now() + expiresIn * 1000),

          metadata: JSON.stringify(userInfo),

        },

      });



      return res.redirect('/admin?social=linkedin-connected');

    } catch (err) {

      console.error('LinkedIn OAuth error:', err);

      return res.status(500).json({ error: 'LinkedIn connection failed' });

    } finally {

      await prisma.$disconnect();

    }

  }



  // Step 0: Redirect user to LinkedIn auth

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=r_liteprofile%20r_emailaddress%20w_organization_social`;

  res.redirect(authUrl);

}

