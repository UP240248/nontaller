import { Role } from '@prisma/client';
import { createInterface } from 'node:readline/promises';
import { Writable } from 'node:stream';
import { hashPassword, validPassword } from './security';
import { databaseClient } from './database';
async function main() {
  if (!process.stdin.isTTY) throw new Error('Ejecuta bootstrap desde una terminal interactiva');
  let muted = false;
  const output = new Writable({write(chunk, _encoding, callback) { if (!muted) process.stdout.write(chunk); callback(); }});
  const rl = createInterface({input:process.stdin,output,terminal:true});
  let name: string; let email: string; let password: string; let confirmation: string;
  try {
    name = (await rl.question('Nombre: ')).trim();
    email = (await rl.question('Correo: ')).trim().toLowerCase();
    process.stdout.write('Contraseña (12–128 caracteres; oculta): '); muted=true;
    password = await rl.question(''); muted=false; process.stdout.write('\nRepite contraseña: '); muted=true;
    confirmation = await rl.question(''); muted=false; process.stdout.write('\n');
  } finally {muted=false;rl.close();}
  if (name.length < 2 || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length>190 || !validPassword(password) || password !== confirmation) throw new Error('Datos inválidos o contraseñas distintas');
  const db = databaseClient();
  try {
    const passwordHash = await hashPassword(password);
    await db.$transaction(async tx=>{
      await tx.$queryRaw`SELECT id FROM AdminLock WHERE id = 1 FOR UPDATE`;
      if (await tx.user.count({where:{active:true,role:Role.ADMINISTRACION}})) throw new Error('Ya existe un administrador activo; utiliza la aplicación');
      const user = await tx.user.create({data:{name,email,passwordHash,role:Role.ADMINISTRACION}});
      await tx.auditEvent.create({data:{actorId:user.id,entity:'User',entityId:user.id,action:'BOOTSTRAP'}});
    });
    console.log('Administrador creado. Ya puedes iniciar sesión.');
  } finally {await db.$disconnect();}
}
main().catch((error: unknown)=>{console.error(error instanceof Error && !('code' in error) ? error.message : 'No se pudo crear el administrador. Comprueba configuración y correo único.');process.exitCode=1;});
