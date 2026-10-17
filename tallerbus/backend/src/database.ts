import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';
export function databaseAdapter() {
  const raw = process.env.DATABASE_URL;
  if (!raw) throw new Error('Falta DATABASE_URL');
  const url = new URL(raw);
  if (url.protocol !== 'mysql:') throw new Error('Se requiere MySQL');
  return new PrismaMariaDb({host:url.hostname,port:Number(url.port||3306),user:decodeURIComponent(url.username),password:decodeURIComponent(url.password),database:decodeURIComponent(url.pathname.slice(1)),connectionLimit:5,timezone:'Z'});
}
export function databaseClient() { return new PrismaClient({adapter:databaseAdapter()}); }
