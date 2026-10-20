# Manual de desarrollo

## Versiones fijadas

Node 24.19.0 (`.node-version`), npm 11.9.0; Angular 21.2.25 y CLI/build 21.2.27; TypeScript 5.9.3; NestJS 12.1.3; Prisma y adaptador oficial MariaDB/MySQL 7.10.1; MySQL 8.4 por digest inmutable. Las versiones exactas y transitivas están en manifiestos y `package-lock.json`. Los motores declarados en npm admiten Node 24; Angular compiler-cli admite TypeScript 5.9. Las compilaciones y pruebas documentan la compatibilidad comprobada.

Prisma 6 fue descartado durante preparación por un advisory de su dependencia deepmerge-ts. Prisma 7 usa el adaptador oficial para conectar a MySQL y mantiene checksum/TLS activos. `prisma.config.ts` configura migraciones y datasource; el schema no contiene credenciales.

## Instalación e inicio

Desde `tallerbus/`, `npm ci`, `npm run setup`, `npm run bootstrap`, `npm run dev`. En este entorno usar `npm_config_cache=/tmp/tallerbus-npm npm ci` si el HOME no permite crear la caché. En PowerShell se puede configurar `$env:npm_config_cache` a una carpeta local escribible.

`setup` ejecuta db:local, generate, migrate y build, deteniéndose ante un fallo. No crea cuentas. `db:local` arranca únicamente el contenedor etiquetado `tallerbus-mysql-local`, crea bases de desarrollo/prueba y guarda claves aleatorias privadas. No sobrescribe configuración existente. Una colisión de contenedor o un fallo de autenticación no provoca borrado de volúmenes.

| Comando | Resultado |
|---|---|
| `npm ci` | Instalación exacta con lockfile |
| `npm run db:local` | MySQL local persistente y variables privadas |
| `npm run generate` | Cliente Prisma en node_modules |
| `npm run migrate` | Aplica migraciones pendientes a desarrollo |
| `npm run build` | Compila API y frontend de producción |
| `npm run bootstrap` | Primer administrador con contraseña oculta |
| `npm run seed:dev` | Cinco cuentas ficticias locales opcionales, claves aleatorias privadas |
| `npm run dev` | API compilada en 3000 y Angular en 4200; Ctrl+C detiene ambos |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript y plantillas Angular estrictos |
| `npm run test:unit` | Contraseñas, tokens y configuración |
| `npm run test:integration` | API real y base aislada; no usa servidor dev |
| `npm run test:e2e` | Chromium, API 3101 y Angular 4201 contra base aislada |
| `npm run check` | Todas las comprobaciones anteriores |

Después de cambiar backend, ejecutar `npm run build -w backend` y reiniciar API. Angular recarga automáticamente. No editar migraciones ya aplicadas; agregar una nueva y probarla en base aislada. Para detectar drift: `node --env-file=.local/backend.env node_modules/prisma/build/index.js migrate diff --from-config-datasource --to-schema backend/prisma/schema.prisma --exit-code`.

## Pruebas y fixtures

Chromium usa `/usr/bin/chromium` por defecto en este entorno. En otra máquina fijar `CHROMIUM_PATH` al ejecutable instalado o instalar Chromium con Playwright y apuntar a su ejecutable. Cada runner usa un proceso propio; integración y E2E regeneran fixtures en `tallerbus_test`, borrando únicamente sus registros. `fixtures.mjs` rechaza cualquier host/base fuera de localhost/tallerbus_test. No ejecutarlos simultáneamente.

Fixtures de prueba tienen correos `.invalid` y contraseñas aleatorias generadas en memoria; no se imprimen. `seed:dev` es explícito y solo funciona en NODE_ENV development y base local `tallerbus`; no sobrescribe bases con usuarios. Repetirlo valida cuentas existentes sin cambiar claves. Si se interrumpe antes del commit puede quedar un archivo privado sin cuentas: revisar el estado antes de corregirlo manualmente. No copiar datos demo a producción.

## Trabajo seguro

El entorno cloud ya está aislado: usar el checkout existente, sin crear worktrees salvo petición explícita. El anterior permanece intacto. No registrar secretos, `.local/`, respaldos ni archivos de evidencia en Git. El instalador no modifica lógica, manifiestos ni lockfiles; escribe solo configuración local ignorada y salidas de compilación. No se migran datos productivos mediante estos comandos.

## Desarrollo de flota

`npm run setup` aplica también las migraciones de Fase 2. `npm run test:integration` ejecuta identidad y flota secuencialmente sobre tallerbus_test; las fixtures eliminan auditoría antes de unidades por su FK restrictiva. `tests/e2e/fleet.spec.mjs` recorre flota con Logística, Mecánico y Administración, además de denegar Operador/Contabilidad. Ningún seed añade autobuses a la base de desarrollo; registrarlos desde UI/API con datos autorizados. No se cambió el lockfile ni se añadieron dependencias para esta fase.

## Desarrollo de Fase 3

`incidents` y `work-orders` se instalan con el mismo `npm ci` y `npm run setup`, sin dependencias nuevas ni cambios de lockfile. La migración aditiva crea relaciones e índices/checks. Los fixtures eliminan eventos, evidencias, piezas descriptivas, cierres, asignaciones, fallas y órdenes en orden seguro, exclusivamente en tallerbus_test. También eliminan solo los archivos de evidencia referenciados por esa base de prueba. Nunca ejecutar fixtures contra desarrollo o producción.

`npm run test:integration` añade workflow.integration.test.mjs; prueba API/MySQL, archivos, autorizaciones y concurrencia. `tests/e2e/workflow.spec.mjs` recorre los tres perfiles y el ciclo con fotos y cantidades reales de prueba, sin mocks. Su grupo serial representa el flujo completo y posterior verificación de alcance.

Evidencias de desarrollo en `.local/evidence`, de pruebas en `.local/evidence-test`; EVIDENCE_DIR permite una carpeta privada alternativa. Guardar archivos con permisos restringidos. No moverlos a frontend/public ni versionarlos. Un proceso puede reiniciarse conservando sus archivos; no asumir que un respaldo de BD incluye esos binarios.

## Desarrollo de Fase 4

Módulo `inventory` y migración aditiva `20261020120000_inventory_catalog`, sin nuevas dependencias. `npm run setup` aplica las cinco migraciones conservando las bases existentes. Cantidades y dinero atraviesan API/Angular como cadenas; Prisma.Decimal usa precisión 50 y HALF_UP a seis decimales para valoración. No convertir importes a Number/parseFloat ni calcular costos en el navegador.

`InventoryLock` tiene fila fija 1 insertada por migración. Todas las mutaciones de almacén, compras y catálogos toman ese bloqueo; se serializan inicialmente para un único almacén. Operaciones financieras usan READ COMMITTED y, cuando afectan una orden, también bloquean autobús → orden para coordinarse con su cierre. No introducir el orden inverso ni tomar InventoryLock desde el cierre existente. El cierre no descuenta stock. El esquema no pretende acreditar rendimiento de alto volumen; medir antes de cambiar la estrategia.

`OperacionInventario` conserva hash SHA-256 canónico de ruta/actor/DTO y respuesta completada en la misma transacción que saldos y ledger. Los intentos fallidos no consumen la clave. Una clave reutilizada con otros datos recibe 409. `MovimientoInventario` es inmutable por API y captura cantidad/valor firmados, costo, descripción/unidad y saldo posterior. Las devoluciones siguen la proporción acumulada del valor original para no crear centavos por redondeos sucesivos; la devolución final recupera exactamente el resto.

`npm run test:integration` incluye `inventory.integration.test.mjs`; `tests/e2e/inventory.spec.mjs` recorre catálogos, compra/aprobación/recepción parcial, entrega, devolución, cierre sin doble descuento y acceso por rol. Ambas suites usan la misma base aislada y deben ejecutarse secuencialmente. Los fixtures eliminan devoluciones antes de entregas, ledger/saldos, registros/partidas/compras y claves antes de piezas, proveedores, órdenes y usuarios. No borrar filas de InventoryLock.

## Desarrollo de Fase 5

Módulo `maintenance`, migración aditiva `20261020210000_preventive` y pantallas de planes/checklist. No se agregan dependencias. `npm run setup` aplica seis migraciones. El vencimiento depende exclusivamente de kilometraje; las pruebas controlan lecturas y cubren igualdad exacta al objetivo, no necesitan reloj simulado.

Las transacciones de programación, edición/activación de planes y checklist usan READ COMMITTED y toman primero autobús, luego orden cuando procede. El cierre existente ya toma autobús → orden y actualiza ejecución/plan bajo ese bloqueo. La edición de flota toma autobús antes de consultar el máximo último servicio; evita una lectura incompatible con cierres concurrentes. No tomar InventoryLock dentro del cierre: las entregas usan InventoryLock → autobús → orden y el cierre no genera movimientos.

Una clave activa única del plan impide dos ejecuciones abiertas; versión de plan evita duplicar programación por reintento. Snapshot y pasos se crean con la orden/asignaciones en la misma transacción. Checklist usa versión de orden, exige exactamente los IDs de esa ejecución y actor mecánico asignado. Cierre preventivo requiere kilometraje revisado igual al actual de flota; no concede a Mecánico edición del odómetro.

`tests/maintenance.integration.test.mjs` cubre permisos, validación, vencimiento/filtros, concurrencia, snapshots, cierre y ledger sin duplicados. `tests/e2e/maintenance.spec.mjs` recorre programación y ejecución con Logística/Mecánico, incluidos móvil y axe. Los fixtures eliminan pasos/ejecuciones/planes antes de órdenes/unidades y usan exclusivamente tallerbus_test local. Nunca insertar intervalos demo en desarrollo mediante setup.

## Desarrollo de Fase 6

Módulo `reports`, sin migraciones ni nuevas dependencias. `npm run setup` conserva las seis migraciones. Todas las consultas de reporte comparten generación de JSON/CSV, autorización/alcance, validación de filtros y proyección explícita. El catálogo lo entrega el servidor; no hardcodear permisos financieros en el navegador. financialReportRoles limita importes a Logística/Contabilidad según aprobación recibida.

Las consultas de filas/conteo/agregados usan transacción REPEATABLE READ. Finanzas usa Prisma.Decimal a precisión 50/HALF_UP; agregados grandes se resuelven en SQL parametrizado y la suma de pedidos redondea primero el total de cada documento. Costos se originan solo en entregas/devoluciones del ledger. No convertir dinero a Number ni mezclar cantidades de unidades diferentes. Los estados de las filas son actuales aunque se filtre fecha de registro/movimiento; no representar los reportes como reconstrucción histórica completa.

CSV comparte filtros, ignora la paginación para filas y limita exportación a 10000 sin truncado. Solo serializa columnas definidas, neutraliza fórmulas en texto/controles iniciales y conserva decimales numéricos negativos validados. Reportes/CSV no-store, attachment para descarga. AuditEvent guarda metadatos de exportación; no contenido ni importes. No escribir ledger/saldos desde un reporte.

Unitarias de CSV están en unit.test.mjs; integración en reports.integration.test.mjs cubre permisos/alcances, filtros, totales/precisión, exportación excesiva y revocación. E2E reports.spec.mjs verifica descargas reales, filtros aplicados, páginas y móvil/axe. Fixtures exclusivamente en tallerbus_test; el caso masivo de 10001 filas vive solo ahí. Integración/E2E secuenciales como en fases anteriores.
