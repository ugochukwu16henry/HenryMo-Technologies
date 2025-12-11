// pages/api/auth/login.js

import { signToken } from '../../../lib/auth';

import { PrismaClient } from '@prisma/client';

import bcrypt from 'bcryptjs';



const prisma = new PrismaClient();



export default async function handler(req, res) {

  if (req.method !== 'POST') {

    res.setHeader('Allow', ['POST']);

    return res.status(405).end(`Method ${req.method} Not Allowed`);

  }



  const { email, password } = req.body;



  if (!email || !password) {

    return res.status(400).json({ error: 'Email and password are required.' });

  }



  try {

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {

      return res.status(401).json({ error: 'Invalid credentials.' });

    }



    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {

      return res.status(401).json({ error: 'Invalid credentials.' });

    }



    const token = signToken({

      id: user.id,

      email: user.email,

      role: user.role,

    });



    // Optional: Set httpOnly cookie for better security

    res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict`);



    return res.status(200).json({ token, user: { id: user.id, email: user.email, role: user.role } });

  } catch (err) {

    console.error(err);

    return res.status(500).json({ error: 'Internal server error.' });

  } finally {

    await prisma.$disconnect();

  }

}

