import {spawn,spawnSync} from 'node:child_process';
import {readFile,access} from 'node:fs/promises';
import {parseEnv} from 'node:util';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {localRuntime} from './lib/local-runtime.mjs';
process.chdir(path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'));
function run(args,env){const result=spawnSync(process.execPath,args,{stdio:'inherit',env:env??process.env,timeout:args[0]==='scripts/check-local-db.mjs'?25000:90000});if(result.error?.code==='ETIMEDOUT')throw new Error('La comprobación tardó demasiado; espera a que Docker termine de iniciar y repite el comando.');if(result.status!==0)throw new Error('Arranque detenido antes de abrir la interfaz. Corrige el paso anterior y vuelve a intentarlo.');}
try{
 if(process.argv.slice(2).some(arg=>arg!=='--demo'))throw new Error('Uso: npm run dev o npm run demo.');
 const demo=process.argv.includes('--demo');
 try{await access('backend/dist/main.js');}catch{throw new Error('Falta compilar la API. Ejecuta npm run setup (o demo:setup para la demostración).');}
 if(demo){try{await access('.local/demo.env');}catch{throw new Error('La demo no está preparada: ejecuta npm run demo:setup una vez.');}}
 console.log('1/3 · Preparando MySQL local. Docker Desktop debe tener el motor activo.');
 run(['scripts/local-db.mjs']);
 const saved=parseEnv(await readFile(demo?'.local/demo.env':'.local/backend.env','utf8'));
 const runtime=localRuntime(saved,demo);const env={...process.env,...saved};
 console.log('2/3 · Comprobando SQL y configuración antes de iniciar la API.');
 run(['scripts/check-local-db.mjs',...(demo?['--demo']:[])],env);
 console.log('3/3 · Iniciando TallerBus. Abre '+runtime.origin+' y deja esta terminal abierta.');
 const child=spawn(process.execPath,['node_modules/concurrently/dist/bin/index.js','-k',demo?'npm:demo:api':'npm:dev:api',demo?'npm:demo:web':'npm:dev:web'],{stdio:'inherit',env});
 for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{if(!child.killed)child.kill(signal);});
 child.on('error',()=>{console.error('No se pudieron iniciar los servicios. Revisa instalación de dependencias y puertos.');process.exitCode=1;});
 child.on('exit',(code,signal)=>{process.exitCode=code??(signal==='SIGINT'||signal==='SIGTERM'?0:1);});
}catch(error){console.error(error.message);process.exitCode=1;}
