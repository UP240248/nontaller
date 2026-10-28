import {createRequire} from 'node:module';
import {localRuntime} from './lib/local-runtime.mjs';
let db;
try{
 localRuntime(process.env,process.argv.includes('--demo'));
 const require=createRequire(import.meta.url);const {databaseClient}=require('../backend/dist/database.js');db=databaseClient();
 await db.$queryRaw`SELECT 1`;
 await db.user.findFirst({select:{id:true,username:true}});
 console.log('Conexión SQL de la aplicación verificada; esquema de usuarios disponible.');
}catch{
 console.error('La API no se iniciará: no pudo verificar MySQL con la cuenta de la aplicación. Si acabas de actualizar, completa npm run setup (o demo:setup). Si ya funcionaba, conserva .local y revisa la configuración de esta copia; no regeneres contraseñas ni borres volúmenes.');process.exitCode=1;
}finally{if(db)await db.$disconnect();}
