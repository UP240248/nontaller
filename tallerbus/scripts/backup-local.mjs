import {backupLocal} from './lib/local-backup.mjs';
if(process.argv.slice(2).some(a=>a!=='--offline'))throw new Error('Uso: npm run backup:local -- --offline');
try{const result=await backupLocal({offline:process.argv.includes('--offline')});console.log('Respaldo local completo:',result.directory);console.log(JSON.stringify({tables:result.tables,evidence:result.evidence,orphanFilesPreserved:result.orphans}));}catch(e){console.error(e.message);process.exitCode=1;}
