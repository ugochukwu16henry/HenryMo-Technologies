// pages/api/cms/pages.js

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
      // Support query parameter ?slug=xxx to get a single page
      const { slug } = req.query;

      if (slug) {
        const page = await prisma.page.findUnique({
          where: { slug: String(slug) }
        });

        if (!page) {
          return res.status(404).json({ error: 'Page not found' });
        }

        return res.json(page);
      }

      // Otherwise return all pages
      const pages = await prisma.page.findMany({
        orderBy: { createdAt: 'desc' }
      });

      return res.json(pages);
    }



    if (!requireAdmin(req, res)) return;



    if (req.method === 'POST') {

      const { title, slug, content } = req.body;

      const page = await prisma.page.create({ data: { title, slug, content } });

      return res.status(201).json(page);

    }



    if (req.method === 'PUT') {

      const { id, title, slug, content } = req.body;

      const page = await prisma.page.update({

        where: { id: Number(id) },

        data: { title, slug, content }

      });

      return res.json(page);

    }



    if (req.method === 'DELETE') {

      const { id } = req.body;

      await prisma.page.delete({ where: { id: Number(id) } });

      return res.json({ success: true });

    }



    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);

    res.status(405).end();

  } catch (err) {

    console.error(err);

    res.status(500).json({ error: 'CMS operation failed.' });

  } finally {

    await prisma.$disconnect();

  }

}

