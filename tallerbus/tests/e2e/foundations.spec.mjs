import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readFileSync} from 'node:fs';
import {parseEnv} from 'node:util';
Object.assign(process.env,parseEnv(readFileSync('.local/test.env','utf8')));
const {db,password,seed}=await import('../fixtures.mjs');
let users;
test.beforeAll(async()=>{users=await seed();});
test.afterAll(async()=>{await db.$disconnect();});
async function login(page,role='ADMINISTRACION'){
 await page.goto('/login');await page.getByLabel('Usuario de acceso',{exact:true}).fill(users[role].username);await page.getByLabel('Contraseña',{exact:true}).fill(password);await page.getByRole('button',{name:'Entrar a TallerBus'}).click();await expect(page.getByRole('heading',{name:/Hola,/})).toBeVisible();
}
async function accessible(page){const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();expect(result.violations).toEqual([]);}
test('administración: alta, edición, activación, revocación y auditoría reales',async({page,browser})=>{
 await page.goto('/login');await expect(page.locator('input[type=email]')).toHaveCount(0);await accessible(page);await login(page);await accessible(page);
 await page.getByRole('link',{name:'Usuarios',exact:true}).click();await page.getByRole('button',{name:'Crear usuario'}).click();
 await expect(page.locator('input[type=email]')).toHaveCount(0);await page.getByLabel('Nombre del empleado').fill('María Taller');await page.getByLabel('Usuario de acceso',{exact:true}).fill('maria.test');await page.getByLabel('Contraseña inicial').fill('Ocho123!');await accessible(page);await page.getByRole('button',{name:'Guardar usuario'}).click();
 let row=page.getByRole('row').filter({hasText:'maria.test'});await expect(row).toBeVisible();
 await row.getByRole('button',{name:'Editar María Taller',exact:true}).click();await page.getByLabel('Nombre del empleado').fill('María Operación');await page.getByRole('button',{name:'Guardar usuario'}).click();await expect(row).toContainText('María Operación');
 await row.getByRole('button',{name:'Desactivar María Operación',exact:true}).click();await page.getByRole('button',{name:'Confirmar',exact:true}).click();await expect(row).toContainText('Inactivo');
 await row.getByRole('button',{name:'Activar María Operación',exact:true}).click();await page.getByRole('button',{name:'Confirmar',exact:true}).click();await expect(row).toContainText('Activo');await accessible(page);
 const context=await browser.newContext();const worker=await context.newPage();await worker.goto('/login');await worker.getByLabel('Usuario de acceso',{exact:true}).fill('maria.test');await worker.getByLabel('Contraseña',{exact:true}).fill('Ocho123!');await worker.getByRole('button',{name:'Entrar a TallerBus'}).click();await expect(worker.getByRole('heading',{name:'Hola, María Operación'})).toBeVisible();
 await row.getByRole('button',{name:'Revocar sesiones de María Operación',exact:true}).click();await page.getByRole('button',{name:'Confirmar',exact:true}).click();await expect(page.getByRole('status')).toContainText('Cambio aplicado');await worker.reload();await expect(worker.getByRole('heading',{name:'Inicia sesión'})).toBeVisible();await context.close();
 await page.getByRole('link',{name:'Auditoría',exact:true}).click();await expect(page.getByRole('cell',{name:'Revocación de sesiones',exact:true}).first()).toBeVisible();await accessible(page);
 await page.getByRole('button',{name:'Cerrar sesión'}).click();await expect(page.getByRole('heading',{name:'Inicia sesión'})).toBeVisible();await page.goto('/usuarios');await expect(page.getByRole('heading',{name:'Inicia sesión'})).toBeVisible();
});
test('roles no administrativos: perfil, rutas administrativas protegidas y móvil',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 for(const role of ['LOGISTICA','MECANICO','OPERADOR','CONTABILIDAD']){
  await login(page,role);await expect(page.getByRole('link',{name:'Usuarios',exact:true})).toHaveCount(0);await page.goto('/usuarios');await expect(page.getByRole('heading',{name:/Hola,/})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await accessible(page);await page.screenshot({path:`test-results/${role.toLowerCase()}-mobile.png`,fullPage:true});
  await page.reload();await expect(page.getByRole('heading',{name:/Hola,/})).toBeVisible();await page.getByRole('button',{name:'Cerrar sesión'}).click();await expect(page.getByRole('heading',{name:'Inicia sesión'})).toBeVisible();
 }
});
test('login informa credenciales inválidas y permite reintentar con teclado',async({page})=>{
 await page.goto('/login');await page.getByLabel('Usuario de acceso',{exact:true}).fill(users.OPERADOR.username);await page.getByLabel('Contraseña',{exact:true}).fill('incorrecta');await page.getByLabel('Contraseña',{exact:true}).press('Enter');await expect(page.getByRole('alert')).toContainText('Usuario o contraseña incorrectos');await page.getByLabel('Contraseña',{exact:true}).fill(password);await page.getByLabel('Contraseña',{exact:true}).press('Enter');await expect(page.getByRole('heading',{name:/Hola,/})).toBeVisible();
});
