// pages/api/social/autopost.js

import { PrismaClient } from '@prisma/client';



const prisma = new PrismaClient();



// Only allow internal cron (use secret token)

export default async function handler(req, res) {

  const auth = req.headers.authorization;

  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {

    return res.status(403).json({ error: 'Forbidden' });

  }



  try {

    const now = new Date();

    const duePosts = await prisma.scheduledPost.findMany({

      where: {

        status: 'SCHEDULED',

        scheduledAt: { lte: now },

      },

      include: { 
        user: { 
          include: { 
            socialAccounts: true 
          } 
        } 
      },

    });



    for (const post of duePosts) {

      try {

        const socialAccount = post.user.socialAccounts.find(acc => acc.platform === post.platform);

        if (post.platform === 'linkedin' && socialAccount?.accessToken) {

          // Post to LinkedIn Company Page

          // First: get organization URN

          const orgRes = await fetch('https://api.linkedin.com/v2/organizationAcls?q=roleAssignee&projection=(elements*(organization~(localizedName)))', {

            headers: { Authorization: `Bearer ${socialAccount.accessToken}` }

          });

          const orgData = await orgRes.json();

          const orgUrn = orgData.elements?.[0]?.organization;



          if (!orgUrn) throw new Error('No org found');



          // Create post

          await fetch('https://api.linkedin.com/v2/ugcPosts', {

            method: 'POST',

            headers: {

              'Authorization': `Bearer ${socialAccount.accessToken}`,

              'X-Restli-Protocol-Version': '2.0.0',

              'Content-Type': 'application/json',

            },

            body: JSON.stringify({

              author: orgUrn,

              lifecycleState: 'PUBLISHED',

              specificContent: {

                'com.linkedin.ugc.ShareContent': {

                  shareCommentary: { text: post.content },

                  shareMediaCategory: 'NONE',

                },

              },

              visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },

            }),

          });



          await prisma.scheduledPost.update({

            where: { id: post.id },

            data: { status: 'POSTED' },

          });

        }



        // Add other platforms (fb, ig, x) similarly

      } catch (err) {

        console.error(`Failed to post ID ${post.id}:`, err);

        await prisma.scheduledPost.update({

          where: { id: post.id },

          data: { status: 'FAILED' },

        });

      }

    }



    res.json({ success: true, posted: duePosts.length });

  } catch (err) {

    console.error(err);

    res.status(500).json({ error: 'Autopost failed' });

  } finally {

    await prisma.$disconnect();

  }

}

