# Validación — Fase 4: inventario y compras

Fecha: 20 de octubre de 2026. Repositorio `UP240248/nontaller`, subproyecto `tallerbus`, rama de trabajo local `tallerbus/fase-4`, a partir de `639bcb5` (Fases 1–3 integradas en main). Este informe acredita ejecución local, no publicación de esta rama ni despliegue productivo.

## Reglas implementadas

Confirmaciones del usuario: un almacén; Logística opera; MXN y promedio ponderado; «Descontar al entregar; sin negativos»; «Aprueba Logística, incluso compras propias».

Catálogos reales con unicidad, normalización, versión, activación e historial. Entradas directas, entregas a órdenes no finalizadas, devoluciones del costo original y ajustes con motivo. Compras con múltiples partidas únicas, aprobación explícita, recepción parcial/completa atómica y cancelación antes de recibir. Sin reservas. Todas las operaciones financieras llevan clave UUID idempotente con respuesta/hash almacenados atómicamente.

Cantidades Decimal hasta tres decimales y valores hasta seis, precisión de cálculo 50 y HALF_UP. Al vaciar una pieza se absorbe el residuo de valoración. Las devoluciones fraccionadas restituyen el valor proporcional acumulado de la entrega original sin multiplicar redondeos. La fuente del costo de refacciones por orden son entregas menos devoluciones: compra y cierre no lo suman otra vez.

## Comprobaciones ejecutadas

Node 24.19.0, npm 11.9.0; Angular 21.2, NestJS 12.1, Prisma 7.10.1, MySQL 8.4 y Chromium del sistema. Sin cambios de dependencias ni lockfile.

| Comando / comprobación | Resultado final |
|---|---|
| `npm run generate` | Cliente Prisma generado |
| `npm run migrate` | Cinco migraciones aplicadas; nueva migración aditiva de inventario |
| `npm run check` | Exit 0: lint, typecheck, builds, unitarias, integración y E2E |
| Unitarias dentro de check | 4 pasadas; 0 fallidas/omitidas/canceladas |
| Integración dentro de check | 71 pasadas: 17 identidad + 13 flota + 20 workflow + 21 inventario; 0 fallidas/omitidas/canceladas |
| E2E dentro de check | 12 pasadas: 4 flota + 3 fundamentos + 3 inventario + 2 workflow; 0 fallidas/omitidas |
| Migraciones desde base vacía temporal | Las cinco aplicadas correctamente; `migrate diff --exit-code` sin diferencias; base temporal propia eliminada al finalizar |
| `git diff --check` | Sin errores de whitespace |

**87 pruebas pasadas** en el check completo. Las pruebas usan exclusivamente MySQL local `tallerbus_test`, con fixtures aislados, y se ejecutan secuencialmente; no alteran la base de desarrollo. La validación adicional de migraciones utiliza otra base temporal propia y no ejecuta fixtures contra ella. No se cargaron piezas, proveedores ni compras ficticias en desarrollo.

## Evidencia de comportamiento

- Permisos de lectura/escritura en servidor, no solo navegación. Todas las mutaciones financieras deniegan Administración/Mecánico/Operador/Contabilidad. Consultas de disponibilidad/materiales de Administración/Mecánico excluyen importes; proveedores/ledger/compras/costos requieren Logística. CSRF obligatorio.
- Rechazo de decimales JSON numéricos, formatos inválidos, cantidades cero/negativas donde no proceden, campos ajenos, motivos en blanco y catálogos inactivos. Restricciones SQL también rechazan mínimo/stock negativos.
- Dos ediciones del catálogo con igual versión producen 200/409 y un solo evento; unidad histórica no modificable tras uso.
- Entradas y recepciones repetidas simultáneamente con misma clave se aplican una sola vez. Clave con otro contenido produce 409.
- Dos entregas competidoras por la misma existencia no producen negativos: una se confirma y otra recibe 409.
- Recepción con una línea excesiva revierte todo el lote, incluidos sus movimientos y cantidades recibidas. Recepción parcial/completa conserva costo de cada partida y versión de compra.
- Devolución limitada al remanente de su entrega, costo original aunque cambie el promedio, admisible después del cierre o inactivación de la pieza. Prueba de seis devoluciones fraccionadas preserva exactamente el valor original.
- Auditoría administrativa sin contactos, importes ni comprobantes privados; historia de compras privada con actor/motivo. FK restrictivas conservan trazabilidad.
- E2E con datos persistidos reales: catálogos → compra propia → aprobación → dos recepciones → entrega → devolución → cierre mecánico. Saldo final conservado después del cierre; costo neto de orden visible solo para Logística.
- Axe WCAG 2 A/AA, 2.1 AA y 2.2 AA en pantallas/formularios recorridos; vista móvil de Mecánico sin desbordamiento horizontal. Captura de la ejecución en `test-results/inventory-mobile.png` (artefacto ignorado, no versionado).

## Límites

No incluye impuestos/descuentos, pagos, devoluciones a proveedor, reservas, múltiples almacenes, tarifas laborales, costos de piezas descriptivas antiguas, reportes generales/exportaciones ni nuevos permisos financieros de Contabilidad. No se migraron datos del proyecto anterior.

El ledger es inmutable mediante la API; el usuario SQL de desarrollo conserva permisos necesarios para migraciones. El bloqueo global del almacén es una decisión inicial de consistencia, no una validación de capacidad de alto volumen. No se declara certificación completa de accesibilidad, rendimiento o restauración en otra máquina.

Las instrucciones cloud de inicio se actualizaron en el borrador de configuración para Fases 1–4, preservando instalación/red/repositorios existentes. Guardar el borrador no publica el entorno ni sube Git. El usuario debe revisar/guardar y publicar desde configuración del entorno si desea activar esa versión reutilizable.
