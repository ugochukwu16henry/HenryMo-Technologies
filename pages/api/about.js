// pages/api/about.js

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
      // Public GET - no auth required
      try {
        const setting = await prisma.setting.findUnique({
          where: { key: 'about_page' },
        });

        if (setting) {
          return res.json(JSON.parse(setting.value));
        }

        // Return default content if not found
        return res.json({
          intro: {
            title: "About HenryMo Technologies",
            paragraph1: "HenryMo Technologies is a full-stack digital solutions company dedicated to helping businesses grow through innovation, design, and advanced technology.",
            paragraph2: "We create websites, mobile apps, enterprise software, and automated systems that are fast, secure, and built to scale. Our mission is simple: turn your ideas into real, high-impact digital solutions.",
          },
          vision: {
            title: "Our Vision",
            content: "To become a leading African-to-global technology powerhouse, offering advanced digital products and automation tools for businesses worldwide.",
          },
          mission: {
            title: "Our Mission",
            content: "To empower businesses and individuals with world-class technology solutions that boost efficiency, growth, and digital transformation.",
          },
          team: {
            name: "Henry M. Ugochukwu",
            role: "Founder & CEO",
            bio: "With years of experience in software development and digital transformation, Henry leads our team in creating innovative solutions that make a difference for businesses worldwide.",
            photo: "/images/henrypassportnew.jpg",
          },
          techStack: ["React", "Vue", "Node.js", "Django", "Flutter", "MySQL", "PostgreSQL", "MongoDB", "REST APIs"],
        });
      } catch (err) {
        console.error('Error fetching about page:', err.message);
        // If Setting model doesn't exist, return defaults
        if (err.message.includes('setting') || err.message.includes('Setting')) {
          return res.json({
            intro: {
              title: "About HenryMo Technologies",
              paragraph1: "HenryMo Technologies is a full-stack digital solutions company dedicated to helping businesses grow through innovation, design, and advanced technology.",
              paragraph2: "We create websites, mobile apps, enterprise software, and automated systems that are fast, secure, and built to scale. Our mission is simple: turn your ideas into real, high-impact digital solutions.",
            },
            vision: {
              title: "Our Vision",
              content: "To become a leading African-to-global technology powerhouse, offering advanced digital products and automation tools for businesses worldwide.",
            },
            mission: {
              title: "Our Mission",
              content: "To empower businesses and individuals with world-class technology solutions that boost efficiency, growth, and digital transformation.",
            },
            team: {
              name: "Henry M. Ugochukwu",
              role: "Founder & CEO",
              bio: "With years of experience in software development and digital transformation, Henry leads our team in creating innovative solutions that make a difference for businesses worldwide.",
              photo: "/images/henrypassportnew.jpg",
            },
            techStack: ["React", "Vue", "Node.js", "Django", "Flutter", "MySQL", "PostgreSQL", "MongoDB", "REST APIs"],
          });
        }
        throw err;
      }
    }

    // Admin-only operations
    if (!requireAdmin(req, res)) return;

    if (req.method === 'POST' || req.method === 'PUT') {
      const content = req.body; // The entire about page content object

      try {
        const setting = await prisma.setting.upsert({
          where: { key: 'about_page' },
          update: {
            value: JSON.stringify(content),
            category: 'content',
          },
          create: {
            key: 'about_page',
            value: JSON.stringify(content),
            category: 'content',
          },
        });

        return res.json({ success: true, setting });
      } catch (err) {
        console.error('Error saving about page:', err.message);
        if (err.message.includes('setting') || err.message.includes('Setting')) {
          return res.status(500).json({ 
            error: 'Settings model not available. Please run: npm run prisma:generate' 
          });
        }
        throw err;
      }
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).end();
  } catch (err) {
    console.error('About page error:', err);
    res.status(500).json({ error: 'About page operation failed.' });
  } finally {
    await prisma.$disconnect();
  }
}

