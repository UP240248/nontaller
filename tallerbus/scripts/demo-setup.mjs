import {spawnSync} from 'node:child_process';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {randomBytes} from 'node:crypto';
import {parseEnv} from 'node:util';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
process.chdir(path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'));
const npm=process.platform==='win32'?'npm.cmd':'npm';
function run(command,args,extra={}){const result=spawnSync(command,args,{stdio:'inherit',...extra});if(result.status!==0)throw new Error('No se completó la preparación demo; conserva .local y revisa el paso anterior');}
try{
 run(npm,['run','db:local'],{shell:process.platform==='win32'});
 const inspect=spawnSync('docker',['inspect','tallerbus-mysql-local'],{encoding:'utf8'});
 if(inspect.status!==0||JSON.parse(inspect.stdout)[0].Config.Labels?.['tallerbus.local']!=='true')throw new Error('Se requiere el contenedor local identificado del proyecto');
 await mkdir('.local',{recursive:true,mode:0o700});
 const file='.local/demo.env';
 try{await writeFile(file,'DATABASE_URL=mysql://tallerbus_demo:'+randomBytes(32).toString('hex')+'@127.0.0.1:3307/tallerbus_demo\nDATABASE_PUBLIC_KEY_FILE=.local/mysql-public-key.pem\nPORT=3002\nFRONTEND_ORIGIN=http://localhost:4202\nCOOKIE_SECURE=false\nSESSION_HOURS=8\nLOGIN_LIMIT=100\nLOGIN_WINDOW_SECONDS=60\nNODE_ENV=development\nEVIDENCE_DIR=.local/evidence-demo\n',{flag:'wx',mode:0o600});}catch(e){if(e.code!=='EEXIST')throw e;}
 const env=parseEnv(await readFile(file,'utf8'));const url=new URL(env.DATABASE_URL);
 if(url.hostname!=='127.0.0.1'||url.port!=='3307'||url.pathname!=='/tallerbus_demo'||url.username!=='tallerbus_demo'||! /^[a-f0-9]{64}$/.test(url.password)||env.NODE_ENV!=='development'||env.PORT!=='3002'||env.FRONTEND_ORIGIN!=='http://localhost:4202'||env.EVIDENCE_DIR!=='.local/evidence-demo')throw new Error('Configuración demo distinta de la esperada; no se sobrescribe');
 const sql="CREATE DATABASE IF NOT EXISTS tallerbus_demo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\nCREATE USER IF NOT EXISTS 'tallerbus_demo'@'%' IDENTIFIED BY '"+url.password+"';\nGRANT SELECT,INSERT,UPDATE,DELETE,CREATE,ALTER,DROP,INDEX,REFERENCES ON tallerbus_demo.* TO 'tallerbus_demo'@'%';";
 const created=spawnSync('docker',['exec','-i','tallerbus-mysql-local','sh','-c','MYSQL_PWD="$MYSQL_ROOT_PASSWORD" mysql -uroot'],{input:sql,encoding:'utf8'});
 if(created.status!==0)throw new Error('No se pudo preparar MySQL demo; no se imprimen credenciales');
 const demoEnvironment={...process.env,...env};
 run(process.execPath,['node_modules/prisma/build/index.js','generate'],{env:demoEnvironment});
 run(process.execPath,['node_modules/prisma/build/index.js','migrate','deploy'],{env:demoEnvironment});
 run(npm,['run','build'],{shell:process.platform==='win32',env:demoEnvironment});
 run(process.execPath,['scripts/seed-demo.mjs'],{env:demoEnvironment});
 console.log('Demo preparada sin modificar tu base tallerbus. Inicio: npm run demo. Credenciales privadas: .local/demo-accounts.json.');
}catch{console.error('No se completó demo:setup. Revisa Docker y el paso indicado; no borres bases, volúmenes ni .local.');process.exitCode=1;}
