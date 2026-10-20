# Validación — Fase 5: mantenimiento preventivo

Fecha: 20 de octubre de 2026. Repositorio `UP240248/nontaller`, subproyecto `tallerbus`, rama local `tallerbus/fase-5` sobre `211fc10` (Fase 4). El informe acredita ejecución local; no implica subida a GitHub, integración en main ni despliegue productivo.

## Reglas aprobadas e implementación

El usuario confirmó «por kilometraje», gestión de planes/asignación por Logística y que desconoce los servicios/intervalos. Autorizó continuar con planes configurables sin valores inventados. No se precargan servicios, intervalos de fabricante, tolerancias ni programación por tiempo.

Plan por unidad con nombre, intervalo en kilómetros, último servicio conocido y checklist; activación, versión, filtros y paginación. El vencimiento se alcanza exactamente cuando kilometraje actual >= último servicio + intervalo, con unidad/plan activos. Una ejecución abierta por plan; programación crea orden, asignaciones y copia histórica de tareas/intervalo/base/objetivo en una transacción, sin fallas ficticias.

Solo mecánico asignado registra avances de checklist de orden en proceso. El cierre exige todas sus tareas completas y la lectura de flota revisada; conserva kilometraje/UTC/responsable, actualiza último servicio y libera la ejecución activa. El próximo objetivo usa lectura real del cierre + intervalo vigente del plan. No cambia el estado del autobús ni genera otro consumo/costo. Administración y Mecánico consultan; solo Logística configura y asigna preventivos. Operador/Contabilidad no reciben acceso nuevo.

## Comprobaciones ejecutadas

Node 24.19.0, npm 11.9.0, Angular 21.2, NestJS 12.1, Prisma 7.10.1, MySQL 8.4 y Chromium del sistema. Sin dependencias nuevas ni cambios de lockfile.

| Comprobación | Resultado final |
|---|---|
| `npm run generate` | Cliente Prisma generado |
| `npm run migrate` | Sexta migración aditiva aplicada conservando las anteriores |
| `npm run check` | Exit 0: lint, typecheck, builds, unitarias, integración y E2E |
| Unitarias | 4 pasadas; 0 fallidas/omitidas/canceladas |
| Integración | 86 pasadas: 17 identidad + 13 flota + 20 workflow + 21 inventario + 15 preventivo; 0 fallidas/omitidas/canceladas |
| E2E | 15 pasadas: 4 flota + 3 fundamentos + 3 inventario + 3 preventivo + 2 workflow; 0 fallidas/omitidas |
| Migraciones desde base vacía temporal | Las seis aplicadas correctamente; `migrate diff --exit-code` sin diferencias; base propia temporal eliminada después |
| `git diff --check` | Sin errores de whitespace |

**105 pruebas pasadas** en el check completo. Integración/E2E se ejecutan secuencialmente y usan exclusivamente `tallerbus_test` local. La comprobación de migraciones usó otra base temporal propia sin fixtures. No se cargaron planes/intervalos ficticios en desarrollo ni se migraron datos productivos.

## Comportamientos comprobados

- Permisos por API, sesiones y CSRF; solo Logística modifica/programa. Administración no reasigna órdenes preventivas aunque conserve coordinación de correctivas. Mecánico ajeno no inicia ni registra checklist.
- Nombre/unidad únicos, intervalo/lecturas enteros válidos, checklist obligatorio de tareas distintas, rechazo de null/campos ajenos y restricciones SQL. El último servicio inicial no puede superar la lectura de flota.
- Vencimiento en igualdad exacta, filtros antes de paginar, búsquedas parametrizadas y literales para `%`, estados activos/inactivos y lecturas controladas. No se necesita reloj simulado porque el calendario no participa en esta regla aprobada.
- Dos programaciones simultáneas con igual versión generan una orden y un conflicto; ningún reporte de falla inventado. Ediciones posteriores conservan intervalo/textos de ejecución.
- Checklist parcial permitido, IDs ajenos rechazados, versiones obsoletas/concurrentes no sobrescriben cambios. Tareas pendientes impiden cierre sin efectos parciales.
- Cierre con lectura obsoleta rechazado. Dos cierres simultáneos crean una sola finalización y una sola actualización de servicio. Checklist finalizado no editable por API.
- Entrega de inventario a preventivo usa el ledger existente. Cerrar no modifica saldo/valor ni genera movimientos adicionales; costo neto conserva su fuente original. No hay habilitación automática de autobús.
- Lectura de flota no puede retroceder antes del último servicio; deactivación/reactivación de plan conserva historia y habilita una futura ejecución con plantilla actual.
- E2E real de Logística: plan con campos de intervalo/base inicialmente vacíos → lectura de odómetro → vencimiento → asignación/orden → edición de plantilla conservando checklist histórico.
- E2E real de Mecánico: inicio → cierre bloqueado por checklist pendiente → registro de tareas → cierre a lectura revisada → próximo objetivo recalculado. Acceso de Administración solo consulta y rechazo de Operador/Contabilidad.
- Axe WCAG 2 A/AA, 2.1 AA y 2.2 AA en pantallas/formularios recorridos, incluida vista móvil sin desbordamiento. Artefacto ignorado `test-results/preventive-mobile.png`; no certificación integral de accesibilidad.

## Límites y publicación

Servicios/intervalos concretos siguen pendientes de captura por Logística con manual/historial/taller. No incluye programación temporal, tolerancias, avisos externos, corrección de cierres/cambio de odómetro, cancelación/reapertura de ejecuciones, tarifas laborales ni nuevos permisos financieros. Ediciones de plantilla afectan futuros servicios; una ejecución ya creada conserva su checklist original.

La Fase 4 permanece guardada en `211fc10` y esta entrega continúa en rama local separada. No se hizo push ni merge de las Fases 4/5. Las instrucciones reutilizables de inicio cloud se actualizaron a Fases 1–5, preservando instalación/red/repositorios existentes. El guardado es un borrador: revisar/guardar/publicar desde la configuración del entorno es independiente de publicar Git o verificar restauración en otra máquina.
