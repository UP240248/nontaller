# Validación — Fase 6: vistas, reportes y CSV

Fecha: 20 de octubre de 2026. Repositorio `UP240248/nontaller`, subproyecto `tallerbus`. Rama de entrega `tallerbus/fase-6` a partir de `c507a16`, que integra las Fases 1–5. La validación funcional se ejecutó en el entorno local cloud; publicación Git, despliegue de aplicación y publicación del entorno son operaciones distintas.

## Reglas y alcance

El usuario autorizó continuar y confirmó «Logística y Contabilidad» para consultar/exportar compras, valoración de inventario y costos de refacciones por autobús. Administración mantiene reportes operativos sin importes. Contabilidad no recibe operaciones de escritura, contactos de proveedores ni acceso operativo general.

Siete reportes: flota, fallas, órdenes, preventivos, compras, inventario y costos. Catálogo servidor según rol, filtros combinados, paginación y totales de todo el conjunto filtrado. Operador solo fallas propias; Mecánico obtiene órdenes asignadas vigentes y fallas propias/asignadas, además de flota/preventivos de consulta. JSON y CSV comparten alcance/proyección/filtros.

Dinero como cadenas decimales, precisión 50/HALF_UP a seis decimales. Pedido redondeado por documento antes de sumar, consistente con las filas. Recibido desde recepciones del ledger y costo operativo exclusivamente desde entregas menos devoluciones; no doble compra/consumo ni tarifas laborales inventadas. Fechas de compras corresponden a creación de compra, costos a movimiento; inventario es valoración actual.

## Comprobaciones ejecutadas

Node 24.19.0, npm 11.9.0, Angular 21.2, NestJS 12.1, Prisma 7.10.1, MySQL 8.4, Chromium del sistema. Sin nuevas dependencias ni migraciones; se conservan las seis migraciones anteriores.

| Comprobación | Resultado final |
|---|---|
| `npm run check` | Exit 0: lint, typecheck, builds, unitarias, integración y E2E |
| Unitarias | 7 pasadas: 4 existentes + 3 de CSV; 0 fallidas/omitidas/canceladas |
| Integración | 102 pasadas: 17 identidad + 13 flota + 20 workflow + 21 inventario + 15 preventivo + 16 reportes; 0 fallidas/omitidas/canceladas |
| E2E | 18 pasadas: 4 flota + 3 fundamentos + 3 inventario + 3 preventivo + 3 reportes + 2 workflow; 0 fallidas/omitidas |
| `git diff --check` | Sin errores de whitespace |

**127 pruebas pasadas** en el check completo. Las pruebas usan exclusivamente `tallerbus_test` local y se ejecutan secuencialmente. El caso de exportación masiva crea 10001 unidades solo en esa base de fixtures; no se cargan datos ficticios en desarrollo. No se repitió la validación de migraciones desde cero porque no cambiaron; la ejecución de las seis y ausencia de drift están acreditadas en Fase 5.

## Evidencia de comportamiento

- 401 sin sesión; catálogo/JSON/CSV respetan rol. Importes denegados a Administración/Mecánico/Operador y permitidos a Logística/Contabilidad. Contabilidad sigue sin escritura o directorio privado de proveedores.
- Operador no ve ni exporta filas/totales de otro reportante aunque filtre su unidad. Mecánico no amplía alcance mediante IDs de mecánicos/unidades ajenos. Reglas aplicadas en servidor, no solo navegación.
- Rangos inclusivos, estados/filtros compatibles y búsqueda literal/parametrizada. Fechas malformadas, filtros incompatibles/campos ajenos y tipo de reporte desconocido producen errores coherentes. Inyección en búsqueda no amplía resultados.
- Totales independientes de página, unidades activas/disponibles y vencimientos de planes/unidades activos. Consultas vacías devuelven cero y CSV con encabezado.
- Totales de compras/recepciones separados; canceladas identificadas fuera del pedido vigente. Caso de micropartidas acredita redondeo por documento y reconciliación de total con filas.
- Valoración reconcilia saldo/ledger. No suma cantidades de piezas de unidades de medida distintas. Costos reconcilian entregas/devoluciones por unidad y excluyen recepción/adquisición. Período de solo devolución genera neto negativo correcto.
- CSV exporta el conjunto completo aunque JSON tenga página/limit reducidos. UTF-8 con BOM, comillas/comas/saltos preservados, fórmulas neutralizadas tras blancos/controles y negativos monetarios preservados como números canónicos.
- Exportación superior a 10000 filas rechazada sin truncado ni auditoría de éxito. Descarga exitosa auditada con tipo/filas/alcance/actor, sin importes o búsquedas privadas. Respuestas no-store; revocación de sesión invalida posteriores exportaciones.
- E2E: Contabilidad consulta compras/inventario/costos, aplica fechas/estado y descarga archivo exacto. Editar filtros sin aplicarlos no altera la descarga de la consulta previa.
- E2E: Administración pagina 22 órdenes y exporta todas o filtra una, sin reportes financieros; Logística consulta también importes. Operador y Mecánico descargan su alcance real.
- Axe WCAG 2 A/AA, 2.1 AA y 2.2 AA en recorridos, móvil sin desbordamiento horizontal. Artefacto ignorado `test-results/reports-operator-mobile.png`, no certificación integral.

## Límites y operación

No incluye check-in/out, asignación operador-unidad, XLSX/PDF, reportes fiscales/pagos, avisos externos, tarifas laborales, inventario histórico reconstruido ni permisos financieros de Administración. Los estados son actuales aunque se filtre registro/movimiento. Una descarga consulta de nuevo; puede diferir de una pantalla anterior si hubo cambios de negocio. Límite de 10000 filas es técnico, no una afirmación de rendimiento a gran escala.

Las instrucciones cloud se actualizan para Fases 1–6, conservando instalación/red/repositorios. El guardado de configuración es un borrador; su revisión/guardado/publicación en la configuración del entorno no equivale a subir Git, desplegar la aplicación o verificar restauración en otra máquina. La entrega Git se debe comprobar con sus referencias remotas.
