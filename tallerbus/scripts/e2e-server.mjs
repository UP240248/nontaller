import { spawn, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseEnv } from 'node:util';
const env={...process.env,...parseEnv(readFileSync('.local/test.env','utf8'))};
const url=new URL(env.DATABASE_URL);
if(url.pathname!=='/tallerbus_test'||!['127.0.0.1','localhost'].includes(url.hostname))throw new Error('E2E requiere base aislada local');
const migrate=spawnSync(process.execPath,['node_modules/prisma/build/index.js','migrate','deploy','--schema','backend/prisma/schema.prisma'],{env,stdio:'inherit'});
if(migrate.status!==0)process.exit(migrate.status??1);
const api=spawn(process.execPath,['backend/dist/main.js'],{env,stdio:'inherit'});
const web=spawn(process.execPath,[resolve('node_modules/@angular/cli/bin/ng.js'),'serve','--host','localhost','--port','4201','--proxy-config','proxy.test.json'],{cwd:'frontend',stdio:'inherit',env});
let stopping=false;
function stop(code=0){if(stopping)return;stopping=true;api.kill('SIGTERM');web.kill('SIGTERM');process.exitCode=code;}
process.on('SIGTERM',()=>stop());process.on('SIGINT',()=>stop());
api.on('exit',code=>stop(code??1));web.on('exit',code=>stop(code??1));
