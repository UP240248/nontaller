import {createRequire} from 'node:module';
const url=new URL(process.env.DATABASE_URL??'');
if(!['localhost','127.0.0.1'].includes(url.hostname)||!['/tallerbus','/tallerbus_demo'].includes(url.pathname))throw new Error('Consulta solo disponible para tus bases locales');
const require=createRequire(import.meta.url);const {databaseClient}=require('../backend/dist/database.js');const db=databaseClient();
try{const users=await db.user.findMany({select:{username:true,name:true,role:true,active:true},orderBy:{username:'asc'}});console.table(users);console.log('No se muestran contraseñas. Usa la misma contraseña que tenías antes de actualizar.');}catch{console.error('No se pudo consultar cuentas: completa setup para aplicar migraciones.');process.exitCode=1;}finally{await db.$disconnect();}
