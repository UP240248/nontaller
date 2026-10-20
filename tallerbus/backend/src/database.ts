import { readFileSync } from 'node:fs';
import { createPublicKey } from 'node:crypto';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';
export function databaseAdapter() {
  const raw = process.env.DATABASE_URL;
  if (!raw) throw new Error('Falta DATABASE_URL');
  const url = new URL(raw);
  if (url.protocol !== 'mysql:') throw new Error('Se requiere MySQL');
  const keyFile=process.env.DATABASE_PUBLIC_KEY_FILE;
  const key=keyFile?readFileSync(keyFile,'utf8'):undefined;
  if(key&&createPublicKey(key).asymmetricKeyType!=='rsa')throw new Error('Clave pública MySQL inválida');
  return new PrismaMariaDb({...(key?{cachingRsaPublicKey:key}:{}),host:url.hostname,port:Number(url.port||3306),user:decodeURIComponent(url.username),password:decodeURIComponent(url.password),database:decodeURIComponent(url.pathname.slice(1)),connectionLimit:5,timezone:'Z'});
}
export function databaseClient() { return new PrismaClient({adapter:databaseAdapter()}); }
