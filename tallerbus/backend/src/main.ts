import { createApp } from './app';
import { settings } from './config';
async function main() { const app = await createApp(); await app.listen(settings().port,'127.0.0.1'); }
main().catch(()=>{ console.error('No fue posible iniciar la API. Comprueba configuración y base de datos.'); process.exitCode=1; });
