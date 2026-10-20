import {verifyLocalBackup} from './lib/local-backup.mjs';
try{if(process.argv.length!==3)throw new Error('Uso: npm run backup:verify -- RUTA_DEL_RESPALDO');console.log(JSON.stringify(await verifyLocalBackup(process.argv[2])));}catch(e){console.error(e.message);process.exitCode=1;}
