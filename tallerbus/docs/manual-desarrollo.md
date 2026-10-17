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
