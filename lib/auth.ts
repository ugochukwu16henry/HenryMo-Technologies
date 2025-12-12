// lib/auth.ts

import jwt from 'jsonwebtoken';

function getSecret(): string {
  const SECRET = process.env.JWT_SECRET;
  if (!SECRET) {
    throw new Error('JWT_SECRET is not set in environment variables.');
  }
  return SECRET;
}

export function signToken(payload: any, expiresIn: string = '7d'): string {
  const SECRET = getSecret();
  return jwt.sign(payload, SECRET, { expiresIn });
}

export function verifyToken(token: string): any {
  try {
    const SECRET = getSecret();
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}

export function hashPassword(_password: string): void {
  // Use bcrypt (import bcrypt in API routes)
  // This is a placeholder; actual hashing happens in API
}

