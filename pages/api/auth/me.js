// pages/api/auth/me.js

import { verifyToken } from '../../../lib/auth';

import { PrismaClient } from '@prisma/client';



const prisma = new PrismaClient();



export default async function handler(req, res) {

  const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');



  if (!token) {

    return res.status(401).json({ error: 'Unauthorized' });

  }



  const payload = verifyToken(token);

  if (!payload) {

    return res.status(401).json({ error: 'Invalid token' });

  }



  try {

    const user = await prisma.user.findUnique({

      where: { id: payload.id },

      select: { id: true, email: true, name: true, role: true }

    });



    if (!user) return res.status(404).json({ error: 'User not found' });



    return res.json(user);

  } catch (err) {

    return res.status(500).json({ error: 'Server error' });

  } finally {

    await prisma.$disconnect();

  }

}

