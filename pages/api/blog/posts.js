// pages/api/blog/posts.js

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
      const { slug, published } = req.query;
      
      if (slug) {
        // Fetch single post by slug
        const post = await prisma.blogPost.findUnique({
          where: { slug: String(slug) },
        });
        
        if (!post) {
          return res.status(404).json({ error: 'Post not found' });
        }
        
        // Only return published posts to public
        const isAdmin = req.headers.authorization || req.cookies.token;
        if (!isAdmin && (!post.published || !post.publishedAt)) {
          return res.status(404).json({ error: 'Post not found' });
        }
        
        return res.json(post);
      }

      // Fetch all posts (filter by published if not admin)
      const isAdmin = req.headers.authorization || req.cookies.token;
      const where = isAdmin && published !== 'true' 
        ? {} 
        : { published: true, publishedAt: { not: null } };

      const posts = await prisma.blogPost.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      return res.json(posts);
    }

    // Admin-only operations
    if (!requireAdmin(req, res)) return;

    if (req.method === 'POST') {
      const { title, slug, content, excerpt, featuredImage, category, tags, published } = req.body;

      const post = await prisma.blogPost.create({
        data: {
          title,
          slug,
          content,
          excerpt: excerpt || null,
          featuredImage: featuredImage || null,
          category: category || null,
          tags: tags || [],
          published: published === true,
          publishedAt: published === true ? new Date() : null,
        },
      });

      return res.status(201).json(post);
    }

    if (req.method === 'PUT') {
      const { id, title, slug, content, excerpt, featuredImage, category, tags, published } = req.body;

      const updateData = {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        featuredImage: featuredImage || null,
        category: category || null,
        tags: tags || [],
        published: published === true,
      };

      // Set publishedAt if being published for the first time
      if (published === true) {
        const existing = await prisma.blogPost.findUnique({ where: { id: Number(id) } });
        if (!existing.publishedAt) {
          updateData.publishedAt = new Date();
        }
      } else {
        updateData.publishedAt = null;
      }

      const post = await prisma.blogPost.update({
        where: { id: Number(id) },
        data: updateData,
      });

      return res.json(post);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      await prisma.blogPost.delete({ where: { id: Number(id) } });
      return res.json({ success: true });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Blog operation failed.' });
  } finally {
    await prisma.$disconnect();
  }
}

