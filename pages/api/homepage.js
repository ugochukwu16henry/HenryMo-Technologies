// pages/api/homepage.js

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
  try {
    if (req.method === 'GET') {
      // Get all homepage settings - public endpoint
      let settings = [];
      
      try {
        settings = await prisma.setting.findMany({
          where: {
            category: 'homepage'
          }
        });
      } catch (err) {
        console.error('Error fetching homepage settings:', err.message);
        // If Setting model doesn't exist, return empty content with defaults
        if (err.message.includes('setting') || err.message.includes('Setting')) {
          return res.json({
            hero: {
              title: '',
              subtitle: '',
              primaryButtonText: '',
              primaryButtonLink: '',
              secondaryButtonText: '',
              secondaryButtonLink: ''
            },
            services: [],
            whyChooseUs: {
              title: '',
              description: '',
              stats: []
            },
            cta: {
              title: '',
              description: '',
              buttonText: '',
              buttonLink: ''
            }
          });
        }
        // For other errors, still try to return empty structure
      }

      // Convert to object for easier use
      const homepageContent = {
        hero: {
          title: '',
          subtitle: '',
          primaryButtonText: '',
          primaryButtonLink: '',
          secondaryButtonText: '',
          secondaryButtonLink: ''
        },
        services: [],
        whyChooseUs: {
          title: '',
          description: '',
          stats: []
        },
        cta: {
          title: '',
          description: '',
          buttonText: '',
          buttonLink: ''
        }
      };

      settings.forEach(setting => {
        try {
          const value = JSON.parse(setting.value);
          if (setting.key === 'homepage_hero') homepageContent.hero = value;
          if (setting.key === 'homepage_services') homepageContent.services = value;
          if (setting.key === 'homepage_why_choose_us') homepageContent.whyChooseUs = value;
          if (setting.key === 'homepage_cta') homepageContent.cta = value;
        } catch (e) {
          console.error('Error parsing setting value for', setting.key, ':', e);
          // If not JSON, use as string
          if (setting.key === 'homepage_hero') homepageContent.hero = setting.value;
          if (setting.key === 'homepage_services') homepageContent.services = setting.value;
          if (setting.key === 'homepage_why_choose_us') homepageContent.whyChooseUs = setting.value;
          if (setting.key === 'homepage_cta') homepageContent.cta = setting.value;
        }
      });

      return res.json(homepageContent);
    }

    // Admin-only operations
    if (!requireAdmin(req, res)) return;

    if (req.method === 'POST' || req.method === 'PUT') {
      const { hero, services, whyChooseUs, cta } = req.body;

      const settingsToUpsert = [];

      if (hero) {
        settingsToUpsert.push({
          key: 'homepage_hero',
          value: JSON.stringify(hero),
          category: 'homepage'
        });
      }

      if (services) {
        settingsToUpsert.push({
          key: 'homepage_services',
          value: JSON.stringify(services),
          category: 'homepage'
        });
      }

      if (whyChooseUs) {
        settingsToUpsert.push({
          key: 'homepage_why_choose_us',
          value: JSON.stringify(whyChooseUs),
          category: 'homepage'
        });
      }

      if (cta) {
        settingsToUpsert.push({
          key: 'homepage_cta',
          value: JSON.stringify(cta),
          category: 'homepage'
        });
      }

      const results = [];
      for (const setting of settingsToUpsert) {
        const result = await prisma.setting.upsert({
          where: { key: setting.key },
          update: { value: setting.value },
          create: setting
        });
        results.push(result);
      }

      return res.json({ success: true, settings: results });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).end();
  } catch (err) {
    console.error('Homepage API error:', err);
    res.status(500).json({ error: 'Homepage operation failed.' });
  } finally {
    await prisma.$disconnect();
  }
}

