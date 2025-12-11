// pages/api/social/schedule.js

import { verifyToken } from '../../../lib/auth';

import { PrismaClient } from '@prisma/client';



const prisma = new PrismaClient();



function requireUser(req, res) {

  const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');

  const payload = verifyToken(token);

  if (!payload) {

    res.status(401).json({ error: 'Unauthorized' });

    return null;

  }

  return payload;

}



export default async function handler(req, res) {

  const user = requireUser(req, res);

  if (!user) return;



  try {

    if (req.method === 'GET') {

      const posts = await prisma.scheduledPost.findMany({

        where: { userId: user.id },

        orderBy: { scheduledAt: 'desc' }

      });

      return res.json(posts);

    }



    if (req.method === 'POST') {

      const { platform, content, mediaUrl, scheduledAt } = req.body;

      const post = await prisma.scheduledPost.create({

        data: {

          platform,

          content,

          mediaUrl,

          scheduledAt: new Date(scheduledAt),

          userId: user.id

        }

      });

      return res.status(201).json(post);

    }



    if (req.method === 'DELETE') {

      const { id } = req.body;

      await prisma.scheduledPost.delete({

        where: { id: Number(id), userId: user.id }

      });

      return res.json({ success: true });

    }



    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);

    res.status(405).end();

  } catch (err) {

    console.error(err);

    res.status(500).json({ error: 'Scheduler error.' });

  } finally {

    await prisma.$disconnect();

  }

}

