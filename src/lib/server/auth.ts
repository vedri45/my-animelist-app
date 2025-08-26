import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from './db';
import { user } from './db/schema';
import { eq } from 'drizzle-orm';
import type { SessionUser } from '$lib/types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(user: SessionUser): string {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      email: user.email 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): SessionUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as SessionUser;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function getUserByEmail(email: string) {
  const result = await db.select().from(user).where(eq(user.email, email)).limit(1);
  return result[0];
}

export async function getUserByUsername(username: string) {
  const result = await db.select().from(user).where(eq(user.username, username)).limit(1);
  return result[0];
}

export async function getUserById(id: number) {
  const result = await db.select().from(user).where(eq(user.id, id)).limit(1);
  return result[0];
}

export async function createUser(username: string, email: string, password: string) {
  const hashedPassword = await hashPassword(password);
  
  const result = await db.insert(user).values({
    username,
    email,
    password: hashedPassword
  }).returning({
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  });
  
  return result[0];
}
