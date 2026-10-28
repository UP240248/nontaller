export function localRuntime(env,demo=false){
 const database=demo?'tallerbus_demo':'tallerbus';const port=demo?3002:3000;const origin='http://localhost:'+(demo?4202:4200);
 let url;try{url=new URL(env.DATABASE_URL);}catch{throw new Error('Configuración local de MySQL inválida; no compartas archivos de .local.');}
 if(env.NODE_ENV!=='development'||url.protocol!=='mysql:'||!['localhost','127.0.0.1'].includes(url.hostname)||url.port!=='3307'||url.pathname!=='/'+database||env.FRONTEND_ORIGIN!==origin||Number(env.PORT)!==port)throw new Error('El arranque local requiere la configuración de su modo: desarrollo 3000/4200 o demo 3002/4202, MySQL local 3307. Revisa .local sin borrar archivos.');
 return {database,port,origin};
}
