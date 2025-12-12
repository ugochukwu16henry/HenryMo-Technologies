import { Router } from 'express';
import { AuthRequest } from '../middleware/auth';
import { requireAdmin } from '../middleware/auth';
import { AppError, ErrorCodes } from '../utils/errors';
import { validate } from '../utils/validation';
import { z } from 'zod';
import prisma from '../config/database';

const router = Router();

const createPageSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  content: z.string(),
});

const updatePageSchema = createPageSchema.partial();

// GET /api/cms/pages
router.get('/pages', async (req, res, next) => {
  try {
    const pages = await prisma.page.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json(pages);
  } catch (error) {
    next(error);
  }
});

// GET /api/cms/pages/:slug
router.get('/pages/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;

    const page = await prisma.page.findUnique({
      where: { slug },
    });

    if (!page) {
      throw new AppError('Page not found', ErrorCodes.NOT_FOUND_001, 404);
    }

    res.json(page);
  } catch (error) {
    next(error);
  }
});

// POST /api/cms/pages
router.post('/pages', ...requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const data = validate(createPageSchema, req.body);

    const existingPage = await prisma.page.findUnique({
      where: { slug: data.slug },
    });

    if (existingPage) {
      throw new AppError('Page with this slug already exists', ErrorCodes.VALIDATION_001, 409);
    }

    const page = await prisma.page.create({
      data,
    });

    res.status(201).json(page);
  } catch (error) {
    next(error);
  }
});

// PUT /api/cms/pages/:id
router.put('/pages/:id', ...requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const data = validate(updatePageSchema, req.body);

    const page = await prisma.page.update({
      where: { id: parseInt(id) },
      data,
    });

    res.json(page);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/cms/pages/:id
router.delete('/pages/:id', ...requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    await prisma.page.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
