// lib/auth.ts

import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
  throw new Error('JWT_SECRET is not set in environment variables.');
}

export function signToken(payload: any, expiresIn: string = '7d'): string {
  return jwt.sign(payload, SECRET, { expiresIn });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}

export function hashPassword(password: string): void {
  // Use bcrypt (import bcrypt in API routes)
  // This is a placeholder; actual hashing happens in API
}

