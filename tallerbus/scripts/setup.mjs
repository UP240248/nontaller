import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
process.chdir(path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'));
const npm=process.platform==='win32'?'npm.cmd':'npm';
for(const target of ['db:local','generate','migrate','build']){
 const p=spawnSync(npm,['run',target],{stdio:'inherit',shell:process.platform==='win32'});
 if(p.status!==0)process.exit(p.status??1);
}
console.log('Fundamentos preparados. Para una cuenta propia: npm run bootstrap. Para fixtures locales explícitos: npm run seed:dev. Inicio: npm run dev.');
