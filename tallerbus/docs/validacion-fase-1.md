# Validación de Fase 1

Entorno comprobado: Linux cloud, Node 24.19.0, npm 11.9.0, MySQL 8.4 local en Docker y Chromium del sistema. Ejecución final de `npm run check` completada con código 0 el 17 de octubre de 2026.

## Alcance

Se verifica autenticación y administración real contra MySQL aislado, no respuestas mock. No hay datos ni migraciones productivas. Las cuentas de prueba son ficticias, con contraseñas aleatorias; ninguna credencial forma parte del repositorio.

## Límites

No se han implementado Fases 2–7. No se ha probado Windows ni publicación/restauración en una tarea nueva. Axe automatizado y recorridos con teclado no certifican por sí solos conformidad completa WCAG 2.2 AA; la revisión manual integral está en Fase 7. No hay despliegue productivo ni pruebas de carga/recuperación productivas. El anterior sigue sin auditar código por los límites de acceso documentados.

## Resultados ejecutados

| Comprobación | Resultado |
|---|---|
| `npm_config_cache=/tmp/tallerbus-npm npm ci` | Instalación limpia desde lockfile, correcta |
| `npm run setup` | MySQL, generación Prisma, migraciones y builds correctos |
| `npm run seed:dev` dos veces | Cinco cuentas locales; segunda ejecución conserva contraseñas |
| `npm run lint` | Sin errores |
| `npm run typecheck` | Backend y plantillas Angular correctos |
| `npm run build` | Backend y frontend correctos; bundle inicial ≈276 kB |
| `npm run test:unit` | 4 pasadas, 0 fallidas/omitidas |
| `npm run test:integration` | 17 pasadas, 0 fallidas/omitidas, MySQL real aislado |
| `npm run test:e2e` | 3 pasadas, 0 fallidas/omitidas, Chromium y API reales |
| `npm audit` | 0 vulnerabilidades conocidas al consultar el registro |
| `prisma migrate diff ... --exit-code` | Código 0; sin diferencias entre BD y schema |
| Reinicio db:local + migrate | Sin pérdida de configuración ni migraciones pendientes |

Unitarias: Argon2id, token aleatorio/CSRF, longitud de contraseña y rechazo de configuración productiva insegura. Integración: credenciales inválidas, cookie, 401/403 por cada rol y acción, CSRF/origen, altas/duplicados, validación/paginación, versión obsoleta, activación/desactivación, cambio de rol, último administrador, concurrencia, revocación, vencimiento, logout, auditoría sin secretos, OpenAPI y límite de intentos.

E2E: alta/edición/activación y revocación visibles, auditoría, logout, perfil de los cuatro roles no administrativos, rutas protegidas, persistencia al recargar, reintento de acceso con teclado y móvil 390×844 sin desbordamiento. Axe comprueba etiquetas WCAG A/AA en login, perfil, tabla, diálogo y auditoría sin violaciones detectadas. No se usaron mocks de autenticación o persistencia.

`npm run dev` se validó además con una cuenta ficticia privada de la base de desarrollo, consulta de usuarios y cierre real de sesión. Las claves permanecen en `.local/dev-accounts.json` ignorado y no se incluyeron en logs ni documentación.

## Configuración cloud guardada

Guardados `install_script` (npm ci + npm run setup) y `start_skill` (reinicio de MySQL/API/Angular y validación), además del dominio `binaries.prisma.sh`. Persistencia confirmada por herramienta con status saved. Esto no publica el entorno ni demuestra restauración en una nueva tarea: revisar y guardar en configuración del entorno y después publicar. El volumen Docker requiere respaldo separado; los procesos deben reiniciarse.
