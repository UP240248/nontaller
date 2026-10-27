import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
const variables=parseEnv(readFileSync('.local/test.env','utf8'));
const url=new URL(variables.DATABASE_URL);
if(!url.pathname.endsWith('/tallerbus_test')||!['127.0.0.1','localhost'].includes(url.hostname))throw new Error('Pruebas permitidas solo en MySQL local tallerbus_test');
const env={...process.env,...variables};
for(const args of [['node_modules/prisma/build/index.js','migrate','deploy','--schema','backend/prisma/schema.prisma'],['--test','--test-concurrency=1','tests/username-migration.test.mjs','tests/integration.test.mjs','tests/fleet.integration.test.mjs','tests/workflow.integration.test.mjs','tests/inventory.integration.test.mjs','tests/maintenance.integration.test.mjs','tests/reports.integration.test.mjs','tests/security.integration.test.mjs','tests/backup.integration.test.mjs']]){
 const result=spawnSync(process.execPath,args,{env,stdio:'inherit'});if(result.status!==0)process.exit(result.status??1);
}
