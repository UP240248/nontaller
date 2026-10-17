# Validación de Fase 3

Estado: flujo operativo implementado y validado. `npm run check` finalizó con código 0: 4 unitarias + 50 de integración + 9 E2E = **63 pruebas pasadas**, sin fallidas, omitidas ni pendientes en esa ejecución.

## Alcance preparado

Reporte → evaluación → orden agrupada → asignación → inicio → espera opcional → finalización con responsable, fecha, labor/piezas y seguimiento propio. Evidencias privadas autorizadas. Sin automatismo o bloqueo de estado del autobús por fallas, por decisión explícita del usuario.

## Migración y recuperación

La primera aplicación local falló en un CHECK que incluía evaluadoPorId, incompatible en MySQL con su FK de actualización CASCADE (error 3823). Se corrigió la nueva migración eliminando esa columna del CHECK; su autoría sigue protegida por servicio y FK. Se completaron únicamente las restricciones pendientes, se verificó schema sin diferencias y se utilizó migrate resolve --applied conforme al estado realmente aplicado. No se borraron tablas, cuentas ni datos de Fases 1/2.

Después se aplicaron las cuatro migraciones corregidas desde cero a una base temporal vacía independiente y se comprobó diff con código 0. La base temporal se eliminó al finalizar; las bases de desarrollo y pruebas permanecieron. La migración incluye FK compuesta de falla/orden/unidad y restricciones exactas de cantidades y finalización única.

## Límites

La Fase 4 debe definir stock, reservas/descuentos, valoración, compras y costos laborales. Las piezas actuales son descriptivas, con cantidad exacta, no movimientos ni importes cero simulados. No se implementó reapertura ni edición del reporte original. EVIDENCE_DIR debe incluirse en respaldos junto a la BD; conciliación de huérfanos y recuperación productiva quedan pendientes. Validación en Linux; no se afirma Windows, publicación/restauración en máquina nueva ni certificación WCAG completa.

## Resultados finales ejecutados

| Comando / comprobación | Resultado |
|---|---|
| `npm run generate` | Cliente generado desde modelo de Fase 3 |
| `npm run migrate` | Cuatro migraciones aplicadas; sin pendientes tras recuperación aditiva |
| Migración desde base temporal vacía + diff | Correcta, código 0; no se reutilizó una BD ya preparada como única evidencia |
| `npm run lint` | Sin errores |
| `npm run typecheck` | Backend y plantillas Angular estrictas correctos |
| `npm run build` | Ambas compilaciones; inicial Angular ≈292 kB |
| `npm run test:unit` | 4 pasadas |
| `npm run test:integration` | 50 pasadas: 17 fundamentos + 13 flota + 20 workflow |
| `npm run test:e2e` | 9 pasadas: 4 flota + 3 fundamentos + 2 flujo/alcance |
| `npm run check` | Ejecución conjunta final con código 0 |

Integración comprueba roles/propiedad, falsificación de campos, rango de fechas y filtros por mecánico, prioridad solo mecánica, archivo falso/SVG/excesivo, descarga autorizada, hash alterado, duplicados sin huérfanos, agrupación misma unidad, directorio mínimo, reasignaciones históricas, inicio/espera y cierre por asignado. Dos cierres concurrentes y una evaluación paralela no duplican la finalización ni dejan estados incoherentes. El test exige que fallas abiertas NO bloqueen habilitar la unidad y que cerrar una orden no cambie ese estado.

El navegador realiza reporte móvil con foto, descarga y verificación de bytes, evaluación por Mecánico, orden con dos fallas, asignación por Logística, diagnóstico/inicio, espera de refacciones, cierre con 75 minutos y 1.25 unidades de una pieza, y consulta propia del operador. Comprueba alcances de otro operador y Contabilidad, dashboard y detalle de unidad. No hay mocks de autenticación, archivos ni BD.

Axe A/AA detectó inicialmente una tabla móvil vacía sin acceso por teclado; se corrigieron los contenedores desplazables con foco y nombre accesible. Otra ejecución encontró un selector de prueba ambiguo entre aviso y carga; se precisó el aviso esperado sin quitar la aserción. El ciclo completo y la ejecución final conjunta pasaron. Hay comprobaciones de teclado, desbordamiento y accesibilidad automatizada; esto no certifica todo WCAG 2.2 AA.

## Persistencia y entrega

Fases 1/2: commit local `da104eb`, rama work, sin push. Fase 3: cambios locales separados, sin commit ni push en esta entrega. Se revisaron archivos de Git para excluir credenciales, .local, dependencias, binarios y resultados.

Se actualizó `start_skill` del borrador cloud, persistencia confirmada por herramienta. El `install_script` existente ejecuta setup y ya incluye estas migraciones. Revisar/guardar la configuración y publicar el entorno para activar su versión reutilizable; no se realizó publicación ni se demostró restauración en otra tarea.
