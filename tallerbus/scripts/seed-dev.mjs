import { randomBytes } from 'node:crypto';
import { readFile, writeFile, rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const {databaseClient}=require('../backend/dist/database.js');
const {hashPassword}=require('../backend/dist/security.js');
const url=new URL(process.env.DATABASE_URL);
if(process.env.NODE_ENV!=='development'||url.pathname!=='/tallerbus'||!['localhost','127.0.0.1'].includes(url.hostname))throw new Error('Seed permitido solo en base local de desarrollo');
const db=databaseClient();
try {
 const file='.local/dev-accounts.json';
 try {
  const accounts=JSON.parse(await readFile(file,'utf8'));
  for(const account of accounts){if(!await db.user.findUnique({where:{email:account.email},select:{id:true}}))throw new Error('Fixture local incompleto. No se sobrescriben cuentas ni credenciales.');}
  console.log('Usuarios de desarrollo ya preparados. No se cambiaron contraseñas.');
 } catch(error) {
  if(error.code!=='ENOENT')throw error;
  const accounts=[];
  for(const role of ['ADMINISTRACION','LOGISTICA','MECANICO','OPERADOR','CONTABILIDAD'])accounts.push({name:`Desarrollo ${role}`,email:`${role.toLowerCase()}@desarrollo.invalid`,role,password:randomBytes(24).toString('base64url')});
  // Archivo privado escrito antes de la transacción: las claves no se pierden si el proceso termina después del commit.
  await writeFile(file,JSON.stringify(accounts,null,2)+'\n',{mode:0o600,flag:'wx'});
  try {
   const prepared=await Promise.all(accounts.map(async({password,...account})=>({...account,passwordHash:await hashPassword(password)})));
   await db.$transaction(async tx=>{
    await tx.$queryRaw`SELECT id FROM AdminLock WHERE id = 1 FOR UPDATE`;
    if(await tx.user.count())throw new Error('La base ya tiene usuarios. Usa bootstrap o la aplicación; no se modifica.');
    for(const data of prepared){const user=await tx.user.create({data});await tx.auditEvent.create({data:{actorId:user.id,entity:'User',entityId:user.id,action:'DEV_SEED'}});}
   });
  } catch(e) {await rm(file);throw e;}
  console.log('Cinco cuentas ficticias locales creadas. Credenciales aleatorias en .local/dev-accounts.json (privado, ignorado por Git). No usar en producción.');
 }
} finally {await db.$disconnect();}
