import { Router, Request, Response } from 'express';

const router = Router();

// Placeholder - inquiries removed from schema
router.post('/', (req: Request, res: Response) => {
  res.json({ message: 'Inquiries feature not implemented' });
});

export default router;
