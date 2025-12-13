// pages/api/settings.js

import { verifyToken } from '../../lib/auth';
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
  if (!requireAdmin(req, res)) return;

  try {
    if (req.method === 'GET') {
      let settings = [];
      
      try {
        settings = await prisma.setting.findMany({
          orderBy: { category: 'asc' },
        });
      } catch (err) {
        console.error('Error fetching settings:', err.message);
        // If Setting model doesn't exist in Prisma client, return empty object
        // User needs to run: npm run prisma:generate
        if (err.message.includes('setting') || err.message.includes('Setting')) {
          return res.json({});
        }
        throw err;
      }

      // Convert array to object for easier frontend use
      const settingsObj = settings.reduce((acc, setting) => {
        acc[setting.key] = {
          value: setting.value,
          category: setting.category,
          id: setting.id,
        };
        return acc;
      }, {});

      return res.json(settingsObj);
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const settings = req.body; // Object of { key: { value, category } }

      const results = [];

      try {
        for (const [key, data] of Object.entries(settings)) {
          const { value, category = 'general' } = data;

          const setting = await prisma.setting.upsert({
            where: { key },
            update: {
              value: String(value),
              category,
            },
            create: {
              key,
              value: String(value),
              category,
            },
          });

          results.push(setting);
        }

        return res.json({ success: true, settings: results });
      } catch (err) {
        console.error('Error saving settings:', err.message);
        if (err.message.includes('setting') || err.message.includes('Setting')) {
          return res.status(500).json({ 
            error: 'Settings model not available. Please run: npm run prisma:generate' 
          });
        }
        throw err;
      }
    }

    if (req.method === 'DELETE') {
      const { key } = req.body;
      try {
        await prisma.setting.delete({ where: { key } });
        return res.json({ success: true });
      } catch (err) {
        console.error('Error deleting setting:', err.message);
        if (err.message.includes('setting') || err.message.includes('Setting')) {
          return res.status(500).json({ 
            error: 'Settings model not available. Please run: npm run prisma:generate' 
          });
        }
        throw err;
      }
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end();
  } catch (err) {
    console.error('Settings error:', err);
    res.status(500).json({ error: 'Settings operation failed.' });
  } finally {
    await prisma.$disconnect();
  }
}

