import { Router, Request, Response } from 'express';

const router = Router();

// Placeholder - client portal removed from schema
router.get('/projects', (req: Request, res: Response) => {
  res.json({ message: 'Client portal feature not implemented' });
});

export default router;
