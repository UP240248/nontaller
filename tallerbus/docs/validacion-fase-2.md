# Validación — Fase 2

Entrega de flota sobre los fundamentos existentes. Comprobaciones completadas: 4 pruebas unitarias, 30 de integración y 7 recorridos de navegador pasaron (41 en total), sin fallidas ni omitidas.

La base de desarrollo recibió migraciones aditivas; las pruebas operan únicamente sobre tallerbus_test. No se migraron datos anteriores ni se ejecutaron operaciones productivas.

Limitaciones: Fases 3–7 pendientes; no hay fallas activas, mantenimiento o costos en el detalle ni se muestran contadores ficticios. Las reglas de bloqueo por fallas y cierre de órdenes requieren aprobación antes de la siguiente fase. Pruebas realizadas en Linux; no se afirma validación en Windows, restauración cloud nueva, producción ni conformidad WCAG completa.

## Evidencia ejecutada

| Comando / comprobación | Resultado |
|---|---|
| `npm run generate` | Cliente Prisma actualizado sin cambiar dependencias |
| `npm run migrate` | Migraciones fleet y fleet_checks aplicadas a desarrollo |
| `npm run lint` | Sin errores |
| `npm run typecheck` | Backend, frontend y plantillas correctos |
| `npm run build` | Ambas compilaciones correctas; inicial Angular ≈285 kB |
| `npm run test:unit` | 4 pasadas |
| `npm run test:integration` | 30 pasadas: 17 identidad + 13 flota |
| `npm run test:e2e` | 7 pasadas: 4 flota + 3 fundamentos |
| `prisma migrate diff --from-config-datasource --to-schema backend/prisma/schema.prisma --exit-code` | Código 0, sin diferencias representables en schema |

Integración valida la normalización y unicidad de placas/económico, DTOs y CHECK SQL de kilometraje, todos los permisos, CSRF, búsqueda/filtros/orden/páginas, separación activo/estado, historia con actor/antes/después, FK que impide borrar unidades con historial, conflicto de versión y KPIs sin doble conteo. Dos ediciones concurrentes producen un 200 y un 409, con solo un evento confirmado.

Navegador prueba alta/edición/activación/estado/historial y KPIs contra API/MySQL reales; Mecánico en 390×844 sin edición administrativa; Operador/Contabilidad sin rutas ni indicadores; duplicados y recarga tras conflicto. Axe no detectó violaciones de las reglas A/AA seleccionadas en listado, formulario, detalle, confirmación, historial y dashboard. Se verificó detalle móvil sin desbordamiento de página. No se usaron mocks ni autobuses en la base de desarrollo como sustituto de pruebas.

El único fallo inicial de preparación fue intentar comparar con un archivo temporal de schema que no existía; se corrigió utilizando la base configurada como origen y arrancando MySQL. No quedan fallos funcionales conocidos de los checks ejecutados.

## Entorno reutilizable y estado Git

`install_script` existente ya ejecuta setup con las migraciones nuevas. Se actualizó `start_skill` y su persistencia fue confirmada (status saved), con permisos y validación de Fase 2. Revisar/guardar y publicar desde configuración del entorno para reutilizar el borrador; no se ha demostrado publicación o restauración en una tarea nueva.

Los cambios siguen locales en tallerbus/. No se creó commit ni se hizo push durante esta entrega. Configuración privada, dependencias y artefactos continúan ignorados. No se modificó el repositorio anterior.

## Guardado posterior

Por solicitud del usuario, Fases 1 y 2 quedaron guardadas en commit local `da104eb`, rama work. No se hizo push. La Fase 3 se desarrolla sobre ese punto sin modificar el commit.
