import {readFile,writeFile,rename,rm} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
// Actualiza archivos privados antiguos sin cambiar sus contraseñas ni los usuarios de BD.
export async function readLocalAccounts(file,db){
 const accounts=JSON.parse(await readFile(file,'utf8'));
 if(!Array.isArray(accounts))throw new Error('Archivo de cuentas locales inválido');
 if(!accounts.some(a=>a.email))return accounts;
 const count=await db.user.count();const result=[];
 for(const account of accounts){
  let username=account.username;
  if(!username){const base=String(account.email??'').split('@')[0].toLowerCase().replace(/[^a-z0-9._-]/g,'');username=base.length>=3&&/^[a-z0-9]/.test(base)?base.slice(0,24):'usuario';const user=await db.user.findUnique({where:{username},select:{username:true,name:true,role:true}});if(count&&(!user||user.name!==account.name||user.role!==account.role))throw new Error('Las cuentas locales no coinciden con la BD migrada; no se alteraron claves');}
  const {email:legacy,...data}=account;void legacy;result.push({...data,username});
 }
 const temporary=file+'.'+randomUUID()+'.tmp';
 try{await writeFile(temporary,JSON.stringify(result,null,2)+'\n',{mode:0o600,flag:'wx'});await rename(temporary,file);}finally{await rm(temporary,{force:true});}
 return result;
}
