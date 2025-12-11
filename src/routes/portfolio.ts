import { Router } from 'express';
import { AuthRequest } from '../middleware/auth';
import { authenticate, requireAdmin } from '../middleware/auth';
import { AppError, ErrorCodes } from '../utils/errors';
import { validate } from '../utils/validation';
import { z } from 'zod';
import prisma from '../config/database';

const router = Router();

const createPortfolioSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  image: z.string().url().optional(),
  techStack: z.array(z.string()),
  liveUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
});

const updatePortfolioSchema = createPortfolioSchema.partial();

// GET /api/portfolio/items
router.get('/items', async (req, res, next) => {
  try {
    const items = await prisma.portfolioItem.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json(items);
  } catch (error) {
    next(error);
  }
});

// GET /api/portfolio/items/:id
router.get('/items/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const item = await prisma.portfolioItem.findUnique({
      where: { id: parseInt(id) },
    });

    if (!item) {
      throw new AppError('Portfolio item not found', ErrorCodes.NOT_FOUND_001, 404);
    }

    res.json(item);
  } catch (error) {
    next(error);
  }
});

// POST /api/portfolio/items
router.post('/items', ...requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const data = validate(createPortfolioSchema, req.body);

    const item = await prisma.portfolioItem.create({
      data,
    });

    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
});

// PUT /api/portfolio/items/:id
router.put('/items/:id', ...requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const data = validate(updatePortfolioSchema, req.body);

    const item = await prisma.portfolioItem.update({
      where: { id: parseInt(id) },
      data,
    });

    res.json(item);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/portfolio/items/:id
router.delete('/items/:id', ...requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    await prisma.portfolioItem.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Portfolio item deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
