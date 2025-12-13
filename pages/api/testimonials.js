// pages/api/testimonials.js

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
      const { featured } = req.query;
      
      const where = featured === 'true' ? { featured: true } : {};
      
      const testimonials = await prisma.testimonial.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      return res.json(testimonials);
    }

    // Admin-only operations
    if (!requireAdmin(req, res)) return;

    if (req.method === 'POST') {
      const { clientName, company, position, testimonial, rating, photo, featured } = req.body;

      const testimonialData = await prisma.testimonial.create({
        data: {
          clientName,
          company: company || null,
          position: position || null,
          testimonial,
          rating: rating ? Number(rating) : null,
          photo: photo || null,
          featured: featured === true,
        },
      });

      return res.status(201).json(testimonialData);
    }

    if (req.method === 'PUT') {
      const { id, clientName, company, position, testimonial, rating, photo, featured } = req.body;

      const testimonialData = await prisma.testimonial.update({
        where: { id: Number(id) },
        data: {
          clientName,
          company: company || null,
          position: position || null,
          testimonial,
          rating: rating ? Number(rating) : null,
          photo: photo || null,
          featured: featured === true,
        },
      });

      return res.json(testimonialData);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      await prisma.testimonial.delete({ where: { id: Number(id) } });
      return res.json({ success: true });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Testimonial operation failed.' });
  } finally {
    await prisma.$disconnect();
  }
}

