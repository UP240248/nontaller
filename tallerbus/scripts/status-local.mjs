import path from 'node:path';
import {pathToFileURL} from 'node:url';
function localOrigin(value){
 const url=new URL(value);
 if(url.origin!==value||url.protocol!=='http:'||!['localhost','127.0.0.1'].includes(url.hostname))throw new Error('Solo se comprueban servicios HTTP locales');
 return url.origin;
}
async function read(url,timeoutMs){
 const response=await fetch(url,{redirect:'error',signal:AbortSignal.timeout(timeoutMs)});
 if(!response.ok)throw new Error('Respuesta HTTP incorrecta');
 return response;
}
async function healthy(url,timeoutMs){
 const response=await read(url,timeoutMs);
 if(!response.headers.get('content-type')?.includes('application/json'))throw new Error('Respuesta de salud no válida');
 const body=await response.json();
 if(body.status!=='ok'||body.database!=='connected')throw new Error('La base de datos no está conectada');
}
export async function localStatus({origin,port,timeoutMs=5000}){
 // Validar todos los destinos antes de hacer peticiones; no seguir redirecciones.
 const frontend=localOrigin(origin);
 if(!Number.isInteger(port)||port<1||port>65535)throw new Error('Puerto local inválido');
 const api='http://127.0.0.1:'+port;
 const checks=[];
 for(const [name,action] of [
  ['API y MySQL',()=>healthy(api+'/api/v1/health',timeoutMs)],
  ['Interfaz local',async()=>{const response=await read(frontend+'/',timeoutMs);if(!response.headers.get('content-type')?.includes('text/html')||!(await response.text()).includes('<app-root'))throw new Error('Interfaz no válida');}],
  ['Proxy de la interfaz a la API',()=>healthy(frontend+'/api/v1/health',timeoutMs)]
 ]){try{await action();checks.push({name,ok:true});}catch{checks.push({name,ok:false});}}
 return {ok:checks.every(c=>c.ok),checks};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
 try{
  const result=await localStatus({origin:process.env.FRONTEND_ORIGIN??'http://localhost:4200',port:Number(process.env.PORT??3000)});
  for(const check of result.checks)console.log((check.ok?'OK: ':'FALTA: ')+check.name);
  console.log(result.ok?'Servicios locales responden. Comprueba también login y permisos desde el navegador.':'Revisa Docker y la terminal de npm run dev; consulta docs/uso-local-personal.md.');
  if(!result.ok)process.exitCode=1;
 }catch{console.error('No se pudo comprobar la configuración local. Revisa origen y puerto sin compartir .local/.');process.exitCode=1;}
}
