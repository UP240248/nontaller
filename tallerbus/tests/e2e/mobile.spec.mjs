import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readFileSync} from 'node:fs';
import {parseEnv} from 'node:util';
Object.assign(process.env,parseEnv(readFileSync('.local/test.env','utf8')));
const {db,password,seed}=await import('../fixtures.mjs');
let users,bus,incident,order;
test.beforeAll(async()=>{
 users=await seed();bus=await db.autobus.create({data:{numeroEconomico:'MOVIL-01',placas:'MOV001',marca:'Prueba',modelo:'Unidad de prueba móvil',kilometraje:1000,estadoOperativo:'HABILITADO'}});
 await db.operadorAutobus.create({data:{operadorId:users.OPERADOR.id,autobusId:bus.id}});await db.user.update({where:{id:users.OPERADOR.id},data:{operatorFleetVersion:1}});
 incident=await db.falla.create({data:{autobusId:bus.id,reportanteId:users.OPERADOR.id,tipo:'Frenos',descripcion:'Revisión de frenos para pruebas en pantalla pequeña',prioridad:'MEDIA',evaluacion:'Inspección de los componentes',evaluadoPorId:users.MECANICO.id,evaluadoAt:new Date()}});
 order=await db.ordenTrabajo.create({data:{autobusId:bus.id,titulo:'Revisión para móvil'}});await db.falla.update({where:{id:incident.id},data:{ordenId:order.id}});
 const part=await db.refaccion.create({data:{sku:'MOV-FIL-01',descripcion:'Filtro de prueba con descripción extensa para revisar el ajuste de texto en celular',unidad:'pieza',minimo:'2'}});await db.saldoInventario.create({data:{refaccionId:part.id,cantidad:'10',valor:'1000'}});
});
test.afterAll(async()=>db.$disconnect());
async function login(page,role){await page.goto('/login');await page.getByLabel('Usuario de acceso',{exact:true}).fill(users[role].username);await page.getByLabel('Contraseña',{exact:true}).fill(password);await page.getByRole('button',{name:'Entrar a TallerBus'}).click();await expect(page.getByRole('heading',{name:/Hola,/})).toBeVisible({timeout:15000});}
async function accessible(page){expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);}
async function snapshot(page,path){await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await expect.poll(()=>page.evaluate(()=>window.scrollY)).toBe(0);await page.screenshot({path,fullPage:true});}
async function fits(page){expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
test('menú móvil compacto: abre, cierra con Escape, respeta roles y cierra al navegar',async({page})=>{
 await page.setViewportSize({width:390,height:844});await login(page,'OPERADOR');const open=page.getByRole('button',{name:'Abrir menú',exact:true});await expect(open).toHaveAttribute('aria-expanded','false');await expect(page.getByRole('navigation',{name:'Navegación principal'})).not.toBeVisible();await accessible(page);await open.click();const nav=page.getByRole('navigation',{name:'Navegación principal'});await expect(nav.getByRole('link',{name:'Mis reportes',exact:true})).toBeVisible();await expect(nav.getByRole('link',{name:'Usuarios',exact:true})).toHaveCount(0);await page.keyboard.press('Escape');await expect(open).toBeFocused();await open.click();await nav.getByRole('link',{name:'Mis reportes',exact:true}).click();await expect(page.getByRole('heading',{name:'Mis reportes',exact:true})).toBeVisible();await expect(open).toHaveAttribute('aria-expanded','false');await expect(page.locator('#main')).toBeFocused();await fits(page);await page.getByRole('link',{name:'Ver reporte de MOVIL-01: Frenos',exact:true}).click();await expect(page.getByRole('heading',{name:'MOVIL-01 · Frenos',exact:true})).toBeVisible();
});
test('listas en celular: datos y acciones en tarjetas legibles a 320 y 390 px; tabla normal en escritorio',async({page})=>{
 await page.setViewportSize({width:390,height:844});await login(page,'LOGISTICA');
 for(const width of [320,390]){
  await page.setViewportSize({width,height:844});
  for(const [route,region,text] of [['/fallas','Listado de fallas','Frenos'],['/ordenes','Listado de órdenes','Revisión para móvil'],['/autobuses','Listado de autobuses','MOVIL-01'],['/inventario','Existencias','MOV-FIL-01'],['/refacciones','Catálogo','MOV-FIL-01']]){
   await page.goto(route);const table=page.getByRole('region',{name:region,exact:true});await expect(table.getByRole('cell').filter({hasText:text}).first()).toBeVisible();await fits(page);expect(await table.evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);await accessible(page);
   if(width===390&&route==='/fallas'){await page.getByRole('button',{name:'Más filtros',exact:true}).click();await page.getByLabel('Estado',{exact:true}).selectOption('PENDIENTE');await page.getByRole('button',{name:'Filtrar',exact:true}).click();await expect(page.getByRole('link',{name:'Ver reporte de MOVIL-01: Frenos',exact:true})).toBeVisible();await page.getByRole('button',{name:'Ocultar filtros',exact:true}).click();}if(width===390&&route==='/fallas')await snapshot(page,'test-results/mobile-incidents-cards.png');
   if(width===390&&route==='/inventario')await snapshot(page,'test-results/mobile-inventory-cards.png');
  }
 }
 await page.setViewportSize({width:1440,height:1000});await page.goto('/fallas');await expect(page.getByRole('button',{name:'Abrir menú',exact:true})).not.toBeVisible();await expect(page.getByRole('columnheader',{name:'Unidad / reporte',exact:true})).toBeVisible();await expect(page.getByRole('link',{name:'Ver reporte de MOVIL-01: Frenos',exact:true})).toBeVisible();
});
test('formularios móviles: agregar tareas y cancelar sin guardar ni salir de la pantalla',async({page})=>{
 await page.setViewportSize({width:390,height:844});await login(page,'MECANICO');await page.goto('/mantenimiento');await page.getByRole('button',{name:'+ Nuevo mantenimiento',exact:true}).click();const dialog=page.getByRole('dialog',{name:'Nuevo mantenimiento',exact:true});await dialog.getByRole('radio',{name:/MOVIL-01/}).check();await page.getByLabel('Nombre del mantenimiento',{exact:true}).fill('Servicio para pantalla móvil');await page.getByLabel('Tarea 1',{exact:true}).fill('Revisar niveles');await page.getByRole('button',{name:'+ Agregar tarea',exact:true}).click();await page.getByLabel('Tarea 2',{exact:true}).fill('Revisar componentes');await fits(page);expect(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);await accessible(page);await page.screenshot({path:'test-results/mobile-maintenance-form.png',fullPage:true});await dialog.getByRole('button',{name:'Cancelar',exact:true}).click();await expect(dialog).not.toBeVisible();expect(await db.planPreventivo.count({where:{nombre:'Servicio para pantalla móvil'}})).toBe(0);
});
