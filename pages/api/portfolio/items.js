// pages/api/portfolio/items.js

import { verifyToken } from '../../../lib/auth';
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
  try {
    if (req.method === 'GET') {
      const items = await prisma.portfolioItem.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return res.json(items);
    }

    // Admin-only operations
    if (!requireAdmin(req, res)) return;

    if (req.method === 'POST') {
      const { title, description, image, techStack, liveUrl, githubUrl } = req.body;

      const item = await prisma.portfolioItem.create({
        data: {
          title,
          description,
          image: image || null,
          techStack: techStack || [],
          liveUrl: liveUrl || null,
          githubUrl: githubUrl || null,
        },
      });

      return res.status(201).json(item);
    }

    if (req.method === 'PUT') {
      const { id, title, description, image, techStack, liveUrl, githubUrl } = req.body;

      const item = await prisma.portfolioItem.update({
        where: { id: Number(id) },
        data: {
          title,
          description,
          image: image || null,
          techStack: techStack || [],
          liveUrl: liveUrl || null,
          githubUrl: githubUrl || null,
        },
      });

      return res.json(item);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      await prisma.portfolioItem.delete({ where: { id: Number(id) } });
      return res.json({ success: true });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Portfolio operation failed.' });
  } finally {
    await prisma.$disconnect();
  }
}
