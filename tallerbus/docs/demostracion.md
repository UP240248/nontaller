# Demostración con datos ficticios

Esta opción crea una base **tallerbus_demo** y una cuenta MySQL exclusiva, separadas de **tallerbus** (tus datos) y **tallerbus_test** (pruebas). No cambia contraseñas ni datos de tus cuentas personales. Los registros se identifican como DEMO y los correos son ficticios `.invalid`.

## Preparar en Windows

Mantén Docker Desktop abierto. Desde tu copia del proyecto, detén primero el servidor anterior con Ctrl+C y ejecuta en PowerShell:

```powershell
cd C:\Users\abiu\Desktop\taller\nontaller\tallerbus
git pull --ff-only
npm.cmd run demo:setup
npm.cmd run demo
```

La primera preparación crea/migra la base independiente, compila y carga datos en una transacción. No elimina información. Si la carpeta está en otra ubicación, usa la ruta de tu copia. No ejecutes bootstrap para entrar a la demo: ya tiene sus propias cuentas. No hace falta instalar dependencias nuevas para este cambio si npm ci ya estaba completo.

Con la terminal de demo abierta, entra en tu equipo a **http://localhost:4202**. La API demo usa 3002. La aplicación habitual continúa usando **http://localhost:4200** con `npm.cmd run dev`.

Usa una ventana **InPrivate/incógnito** para la demostración. Las cookies de localhost se comparten entre puertos: entrar en la demo desde el mismo perfil del navegador puede sustituir la cookie de tu sesión habitual (no borra datos; puedes volver a entrar). No cambies el origen ni uses 127.0.0.1 en el navegador.

## Cuentas de demostración

Los cinco roles tienen contraseñas aleatorias propias, guardadas solo en tu computadora:

```powershell
notepad .local\demo-accounts.json
```

Cada objeto contiene `role`, `email` y `password`. Usa el correo/contraseña del rol que quieras mostrar. No compartas el archivo por chat, capturas, correo o Git. No son las credenciales de tu administrador personal.

| Rol | Qué puedes mostrar |
|---|---|
| Administración | Usuarios demo, auditoría, flota y coordinación correctiva; sin importes |
| Logística | Todos los módulos operativos, compras, inventario, planes y reportes |
| Mecánico | Evaluaciones, trabajos asignados, checklist y finalización |
| Operador | Sus 12 reportes de fallas, seguimiento y captura |
| Contabilidad | Reportes de compras, valoración y costos |

## Contenido inicial

- 12 autobuses ficticios DEMO-001 a DEMO-012, con distintos estados y una unidad inactiva.
- 12 fallas: pendientes sin evaluación, evaluadas, en proceso y finalizadas.
- 9 órdenes: 8 correctivas (2 abiertas, 3 en proceso, 3 finalizadas) y 1 preventiva abierta asignada.
- 6 refacciones con saldos, entradas, entregas y una devolución; alertas de mínimo.
- 3 proveedores ficticios; 5 compras en borrador, aprobada, parcial, recibida y cancelada.
- 6 planes preventivos, incluyendo 3 vencidos y una ejecución programada con checklist.
- Historial ficticio, minutos de reparaciones y costos conciliados con movimientos.

Los kilometrajes, intervalos, marcas, importes y tareas son ilustrativos; **no son recomendaciones de mantenimiento ni información de la empresa**. No se agregan fotos reales ni contactos privados. Los eventos de creación se marcan DEMO para distinguirlos de acciones hechas después desde la interfaz.

## Recorrido sugerido para presentar

1. Entra con **Logística** y muestra flota/indicadores y los estados de los autobuses.
2. Abre fallas y órdenes para comparar una abierta, una en proceso y una finalizada; revisa materiales.
3. En Inventario muestra una pieza con alerta, existencias e historial de movimientos.
4. En Compras abre el ejemplo parcial y compara pedido/recibido; si recibes el pendiente, solo cambia la demo.
5. En Mantenimiento muestra planes vencidos y la orden preventiva ya asignada.
6. En Reportes consulta costos por autobús, valoración y exportación CSV.
7. Cierra sesión y entra con **Mecánico** para mostrar su trabajo asignado; con **Operador**, sus propios reportes; con **Contabilidad**, los informes financieros.
8. Usa Administración para mostrar usuarios/auditoría y la separación de permisos.

## Repetición y salida

`demo:setup`/`demo:seed` reconocen una instalación completada: no duplican datos, no vuelven a crear contraseñas ni reemplazan tus cambios de demostración. Si falla una carga, la transacción no deja operaciones comerciales a medias. Si hay datos ajenos sin la marca de instalación se rechaza la carga; no se vacía esa base para forzarla.

Para cerrar, Ctrl+C en la terminal demo. Para volver a usar tus datos, ejecuta `npm.cmd run dev`, abre localhost:4200 e inicia sesión con tu cuenta habitual. No es necesario eliminar ninguna base. No se incorpora un comando de borrado/reset; las demostraciones modificadas se conservan.

La demo utiliza el mismo contenedor MySQL local, pero otro esquema/usuario y carpeta de evidencias `.local/evidence-demo`. No lo expone a la red. Los helpers backup:local y backup:verify siguen destinados a tallerbus/tallerbus_test; no se amplía su alcance implícitamente a demo. Los respaldos de tus datos personales siguen igual.

## Verificación técnica

`npm.cmd run demo:check` comprueba el **dataset inicial**, conciliación de stock/valores, aislamiento SQL, reejecución sin duplicados, protección de la BD personal y acceso de los cinco roles. Ejecútalo antes de editar los ejemplos, pues después sus cantidades/estados pueden cambiar legítimamente. El test crea y cierra sesiones en la base demo; no reinicia bases ni carga fixtures personales. No se añade al runner de pruebas que limpia tallerbus_test.

## Evidencia de esta entrega — 27 de octubre de 2026

En el entorno Linux de desarrollo se ejecutaron correctamente lint, demo:setup (generación, seis migraciones, compilación y carga), seis casos de demo:check y un recorrido real con Chromium: login de Logística, flota, fallas, órdenes, inventario, mantenimiento, reportes, salud a través del proxy y logout. La repetición del seed conservó todos los hashes de tablas demo y personales; la cuenta SQL demo recibió denegación al intentar leer tallerbus y tallerbus_test. No se imprimieron contraseñas ni datos internos. No se afirma una ejecución en la computadora Windows del usuario. No cambió la lógica de negocio ni se repitió la suite completa de aplicación para esta carga aislada.
