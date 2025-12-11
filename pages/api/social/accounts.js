// pages/api/social/accounts.js

import { verifyToken } from '../../../lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const payload = verifyToken(token);
  if (!payload || !['ADMIN', 'SUPERADMIN'].includes(payload.role)) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  try {
    if (req.method === 'GET') {
      const accounts = await prisma.socialAccount.findMany({
        where: { userId: payload.id },
        orderBy: { createdAt: 'desc' },
      });

      // Don't expose full access tokens in response
      const safeAccounts = accounts.map((acc) => ({
        id: acc.id,
        platform: acc.platform,
        expiresAt: acc.expiresAt,
        metadata: acc.metadata,
        createdAt: acc.createdAt,
        // Show only last 4 chars of token for verification
        accessToken: acc.accessToken.substring(acc.accessToken.length - 4),
      }));

      return res.json(safeAccounts);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await prisma.socialAccount.delete({
        where: { id: Number(id), userId: payload.id },
      });
      return res.json({ success: true });
    }

    res.setHeader('Allow', ['GET', 'DELETE']);
    res.status(405).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  } finally {
    await prisma.$disconnect();
  }
}

