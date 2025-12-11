import { Router, Request, Response } from 'express';

const router = Router();

// Placeholder - testimonials removed from schema
router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Testimonials feature not implemented' });
});

export default router;
