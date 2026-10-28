import { parseEnv } from 'node:util';
import { createPublicKey, randomBytes } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
process.chdir(root);
const dir=path.join(root,'.local');await mkdir(dir,{recursive:true,mode:0o700});
const secret=()=>randomBytes(32).toString('hex');
let state;
try{state=JSON.parse(await readFile(path.join(dir,'database.json'),'utf8'));}
catch(e){if(e.code!=='ENOENT')throw e;state={root:secret(),dev:secret(),test:secret()};await writeFile(path.join(dir,'database.json'),JSON.stringify(state),{mode:0o600,flag:'wx'});}
const container='tallerbus-mysql-local';
function docker(args,input){const p=spawnSync('docker',args,{input,encoding:'utf8'});if(p.status!==0)throw new Error(args[0]==='info'?'Docker Desktop no está listo. Ábrelo, espera a que el motor esté activo y repite npm run dev (o demo).':'Falló una operación de MySQL local. Revisa Docker y puerto 3307; no borres volúmenes ni .local.');return p.stdout;}
docker(['info','--format','{{.ServerVersion}}']);
const existing=spawnSync('docker',['inspect',container],{encoding:'utf8'});
if(existing.status===0){
 const info=JSON.parse(existing.stdout)[0];
 if(info.Config.Labels?.['tallerbus.local']!=='true')throw new Error('Nombre de contenedor ocupado por otro servicio');
 docker(['update','--restart','unless-stopped',container]);
 docker(['start',container]);
}else{
 await writeFile(path.join(dir,'mysql.env'),`MYSQL_ROOT_PASSWORD=${state.root}\n`,{mode:0o600});
 docker(['run','-d','--name',container,'--label','tallerbus.local=true','--restart','unless-stopped','--env-file',path.join(dir,'mysql.env'),'-p','127.0.0.1:3307:3306','-v','tallerbus-mysql-local-data:/var/lib/mysql','mysql@sha256:24989179f58856db763f418010c1169fecc944e3ec1ea7e921572d83eb070f70']);
}
let ready=false;
for(let n=0;n<60;n++){
 const p=spawnSync('docker',['exec',container,'sh','-c','MYSQL_PWD="$MYSQL_ROOT_PASSWORD" mysql -uroot -Nse "SELECT 1"'],{encoding:'utf8'});
 if(p.status===0){ready=true;break;}await new Promise(resolve=>setTimeout(resolve,1000));
}
if(!ready)throw new Error('MySQL no respondió en 60 segundos');
// Clave pública desde el contenedor local identificado; no descargar claves por la red.
const publicKey=docker(['exec',container,'cat','/var/lib/mysql/public_key.pem']);
if(createPublicKey(publicKey).asymmetricKeyType!=='rsa')throw new Error('Clave pública MySQL inesperada');
await writeFile(path.join(dir,'mysql-public-key.pem'),publicKey,{mode:0o600});
const sql=`CREATE DATABASE IF NOT EXISTS tallerbus CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS tallerbus_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'tallerbus'@'%' IDENTIFIED BY '${state.dev}';
CREATE USER IF NOT EXISTS 'tallerbus_test'@'%' IDENTIFIED BY '${state.test}';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, INDEX, REFERENCES ON tallerbus.* TO 'tallerbus'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, INDEX, REFERENCES ON tallerbus_test.* TO 'tallerbus_test'@'%';`;
docker(['exec','-i',container,'sh','-c','MYSQL_PWD="$MYSQL_ROOT_PASSWORD" mysql -uroot'],sql);
for(const mode of ['dev','test']){
 const isTest=mode==='test';
 const file=path.join(dir,isTest?'test.env':'backend.env');
 // No sobrescribir configuración local existente.
 const content=`DATABASE_URL=mysql://${isTest?'tallerbus_test':'tallerbus'}:${state[mode]}@127.0.0.1:3307/${isTest?'tallerbus_test':'tallerbus'}\nPORT=${isTest?3101:3000}\nFRONTEND_ORIGIN=http://localhost:${isTest?4201:4200}\nCOOKIE_SECURE=false\nSESSION_HOURS=8\nLOGIN_LIMIT=${isTest?100:10}\nLOGIN_WINDOW_SECONDS=60\nNODE_ENV=${isTest?'test':'development'}\n`;
 try{await writeFile(file,content,{mode:0o600,flag:'wx'});}catch(e){if(e.code!=='EEXIST')throw e;}
 const saved=await readFile(file,'utf8');if(!parseEnv(saved).DATABASE_PUBLIC_KEY_FILE)await writeFile(file,saved+(saved.endsWith('\n')?'':'\n')+'DATABASE_PUBLIC_KEY_FILE=.local/mysql-public-key.pem\n',{mode:0o600});
}
console.log('MySQL local disponible. Configuración privada en .local/. No se creó ningún usuario de aplicación.');
