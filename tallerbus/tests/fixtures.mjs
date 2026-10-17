import { randomBytes } from 'node:crypto';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const {hashPassword}=require('../backend/dist/security.js');
const {databaseClient}=require('../backend/dist/database.js');
export const password=randomBytes(20).toString('base64url');
export const db=databaseClient();
export async function seed() {
 const url=new URL(process.env.DATABASE_URL);
 if(url.pathname!=='/tallerbus_test'||!['localhost','127.0.0.1'].includes(url.hostname))throw new Error('Fixtures solo en base local aislada');
 await db.auditEvent.deleteMany();await db.autobus.deleteMany();await db.session.deleteMany();await db.user.deleteMany();
 await db.adminLock.upsert({where:{id:1},create:{id:1},update:{}});
 const passwordHash=await hashPassword(password);const users={};
 for(const role of ['ADMINISTRACION','LOGISTICA','MECANICO','OPERADOR','CONTABILIDAD']){
  users[role]=await db.user.create({data:{name:`Prueba ${role}`,email:`${role.toLowerCase()}@test.invalid`,passwordHash,role}});
 }
 return users;
}
