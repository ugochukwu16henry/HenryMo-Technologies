// pages/api/portfolio/items.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const items = await prisma.portfolioItem.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return res.json(items);
    }

    res.setHeader('Allow', ['GET']);
    res.status(405).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch portfolio items.' });
  } finally {
    await prisma.$disconnect();
  }
}

