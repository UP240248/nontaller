import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import * as argon2 from 'argon2';
export const COOKIE = 'tallerbus_session';
export const hashToken = (token: string): string => createHash('sha256').update(token).digest('hex');
export const csrfToken = (token: string): string => hashToken(`csrf:${token}`);
export const newToken = (): string => randomBytes(32).toString('hex');
export function equalToken(a: string, b: string): boolean {
  return a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
export function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, { type: argon2.argon2id, memoryCost: 65536, timeCost: 3, parallelism: 1 });
}
export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  try { return await argon2.verify(hash, password); } catch { return false; }
}
export function validPassword(value: string): boolean { return value.length >= 12 && value.length <= 128; }
