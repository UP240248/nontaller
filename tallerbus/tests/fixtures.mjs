import { rm } from 'node:fs/promises';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const {hashPassword}=require('../backend/dist/security.js');
const {databaseClient}=require('../backend/dist/database.js');
const {evidenceDirectory}=require('../backend/dist/incidents/evidence.service.js');
export const password=randomBytes(20).toString('base64url');
export const db=databaseClient();
export async function seed() {
 const url=new URL(process.env.DATABASE_URL);
 if(url.pathname!=='/tallerbus_test'||!['localhost','127.0.0.1'].includes(url.hostname))throw new Error('Fixtures solo en base local aislada');
 const evidence=await db.evidenciaFalla.findMany({select:{storageKey:true}});
 for(const item of evidence)if(/^[a-f0-9-]{36}\.(png|jpg)$/.test(item.storageKey))await rm(path.join(evidenceDirectory(),item.storageKey),{force:true});
 await db.auditEvent.deleteMany();await db.pasoPreventivo.deleteMany();await db.ejecucionPreventiva.deleteMany();await db.planPreventivo.deleteMany();await db.movimientoInventario.deleteMany({where:{tipo:"DEVOLUCION"}});await db.movimientoInventario.deleteMany();await db.saldoInventario.deleteMany();await db.registroCompra.deleteMany();await db.lineaCompra.deleteMany();await db.compra.deleteMany();await db.operacionInventario.deleteMany();await db.refaccion.deleteMany();await db.proveedor.deleteMany();await db.evidenciaFalla.deleteMany();await db.refaccionDescriptiva.deleteMany();await db.finalizacionOrden.deleteMany();await db.asignacionMecanico.deleteMany();await db.falla.deleteMany();await db.ordenTrabajo.deleteMany();await db.autobus.deleteMany();await db.session.deleteMany();await db.user.deleteMany();
 await db.adminLock.upsert({where:{id:1},create:{id:1},update:{}});
 const passwordHash=await hashPassword(password);const users={};
 for(const role of ['ADMINISTRACION','LOGISTICA','MECANICO','OPERADOR','CONTABILIDAD']){
  users[role]=await db.user.create({data:{name:`Prueba ${role}`,username:`${role.toLowerCase()}.test`,passwordHash,role}});
 }
 return users;
}
