# Operación local y Windows

## Requisitos

Node 24.19.0, npm 11.9.0, Git y Docker Engine/Desktop con contenedores Linux y puerto 3307 libre. Windows: habilitar el backend Linux/WSL2 de Docker Desktop antes de ejecutar los mismos comandos en PowerShell. Los scripts Node evitan dependencias de Bash del host; los comandos `sh` se ejecutan dentro del contenedor Linux. La ejecución en Windows no ha sido comprobada en esta entrega.

## Procedimiento

1. Abrir `tallerbus/`, ejecutar `npm ci` y `npm run setup`.
2. El contenedor MySQL usa la imagen fijada por digest. `scripts/local-db.mjs` espera respuesta SQL, crea `tallerbus` y `tallerbus_test` y usuarios separados. Sus cuentas locales incluyen DDL para migraciones; antes de producción separar migrador y usuario de ejecución.
3. `.local/backend.env` configura API; `.local/test.env` configura pruebas. Se generan sin sobrescribir archivos existentes. La plantilla `.env.example` no contiene claves reales. Mantener permisos privados y, en Windows, ACL restringida al usuario local.
4. Ejecutar `npm run bootstrap` en terminal interactiva, o `npm run seed:dev` exclusivamente para evaluar con cuentas ficticias. Las claves de estas últimas se consultan localmente en `.local/dev-accounts.json`; no enviarlas a chats ni guardarlas en commits.
5. Ejecutar `npm run dev`. API en 3000 y frontend local en 4200. Abrir la aplicación usando el hostname **localhost**, coherente con FRONTEND_ORIGIN, para las cookies y el control de origen. El frontend envía `/api` a la API mediante proxy. Swagger disponible en `/api/docs` de la API en desarrollo.
6. Comprobar `GET /api/v1/health` (status ok y database connected) e iniciar sesión. Una respuesta de salud no sustituye probar permisos y navegación.

Para detener aplicaciones usar Ctrl+C; para detener únicamente MySQL local, `docker stop tallerbus-mysql-local`. Para reanudar, `npm run db:local`, `npm run migrate` y `npm run dev`. No usar eliminación de volúmenes para resolver errores. Los procesos no sobreviven a nuevas tareas cloud. No se ofrecen previews de loopback en onboarding.

## Variables y políticas técnicas provisionales

| Variable | Uso / valor local |
|---|---|
| DATABASE_PUBLIC_KEY_FILE | Clave pública RSA local fijada desde el contenedor; db:local añade la variable si falta; no es TLS remoto |
| DATABASE_URL | Conexión privada MySQL; nunca versionar valor real |
| PORT | 3000 desarrollo, 3101 pruebas |
| FRONTEND_ORIGIN | Origen exacto, sin ruta ni slash final |
| COOKIE_SECURE | false solo HTTP local; true requerido en producción |
| SESSION_HOURS | 8 local; rango técnico 1–168 |
| LOGIN_LIMIT | 10 intentos/IP por ventana en desarrollo, 100 en pruebas |
| LOGIN_WINDOW_SECONDS | 60 local; rango técnico 1–3600 |
| NODE_ENV | development, test o production |

Duración y límites son valores técnicos iniciales configurables, no SLAs ni políticas comerciales aprobadas. Límite de acceso en memoria para una sola instancia; reinicia con el proceso. Producción exige revisar política, HTTPS, reverse proxy de confianza, despliegue de estáticos, TLS de BD remota, permisos MySQL mínimos, restauración y observabilidad. No se declara preparación productiva ni se impone proveedor cloud. La API se enlaza a loopback para uso local; una exposición futura requiere revisión explícita.


## Respaldo y revisión operativa

Ver [Respaldos y restauración local](respaldos.md) y [Guía de operación](operacion.md). Los helpers incorporados solo trabajan con Docker/MySQL local y verifican en una base temporal nueva; no reemplazan desarrollo ni producción. Conservar el origen y una copia externa cifrada conforme a política definida por Terrabus. La compatibilidad Windows sigue sin comprobarse: permisos de archivos deben sustituirse por ACL adecuadas allí.
