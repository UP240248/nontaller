# Guía de operación y revisión de entrega

## Inicio y comprobación local

Desde `tallerbus/`, Node 24.19.0, npm 11.9.0, Docker Linux y Chromium:

```sh
npm ci
npm run setup
npm run dev
```

`setup` inicia/verifica MySQL, obtiene la clave pública RSA del contenedor identificado, conserva configuración privada, genera cliente, aplica las seis migraciones aditivas y compila. No crea usuarios o datos comerciales. Para primera cuenta propia usar `npm run bootstrap` interactivo; fixtures de desarrollo solo si se eligen explícitamente. No compartir `.local/` ni sus credenciales.

API enlazada a loopback, frontend con hostname localhost para coincidir con Origin/cookies. Comprobar health (status ok/database connected), login, acceso del rol correcto y descarga de una foto autorizada si existe. Detener aplicaciones con Ctrl+C. Para reanudar MySQL: `npm run db:local`. No borrar volúmenes ni regenerar contraseñas para solucionar un fallo.

Después de reiniciar MySQL, el driver puede requerir autenticación completa `caching_sha2_password`; `DATABASE_PUBLIC_KEY_FILE` fija la clave obtenida del contenedor local de confianza, sin recuperación de claves por red. Una ruta/clave inválida falla cerrada. Es autenticación local, no TLS de consultas remotas. `db:local` añade solo esta variable si faltaba, sin reemplazar credenciales existentes.

## Validaciones disponibles

| Comando | Alcance |
|---|---|
| `npm run check` | Lint, tipos, builds, unitarias, integración MySQL y E2E; incluye seguridad y ensayo de respaldo/restauración |
| `npm audit --json` | Dependencias completas según registro/advisories disponibles en ese momento |
| `npm audit --omit=dev --json` | Dependencias de ejecución |
| `npm run test:load` | Referencia técnica de 50 autobuses/10 usuarios/200 lecturas; elimina fixtures de tallerbus_test |
| `npm run test:load -- --buses 200 --users 30 --rounds 20` | Otro escenario técnico explícito; no ejecutado por defecto ni SLA |
| `npm run backup:local -- --offline` | Copia privada local con API y demás escritores detenidos |
| `npm run backup:verify -- RUTA` | Ensayo aislado con conciliación, fotos y revocación de sesiones en copia |

Integración, E2E y carga usan `tallerbus_test`, eliminan fixtures y deben ejecutarse secuencialmente. No apuntarlos a datos reales. Resultado de carga en `.local/validation/load.json`; latencias HTTP locales no incluyen red pública, TLS/proxy o carga de producción. No probar resistencia causando escrituras masivas en desarrollo/productivo.

## Seguridad de dependencias

Se fijaron overrides de Vite 7.3.7 y MCP SDK 1.32.0, conservando Angular 21.2.27 y el resto del lockfile. Corrigen los avisos de herramientas de desarrollo detectados en Vite 7.3.6/SDK 1.31.0. Metadatos/integridades proceden de la resolución del registro; no se desactivaron TLS o checksums ni se editaron paquetes instalados. Retirar/revisar overrides cuando Angular publique una actualización mantenida que incorpore esas versiones.

Con npm 11.9.0, `npm ls` muestra ELSPROBLEMS al comparar los pines internos originales de Angular con estos overrides de workspace. Se observó esa incidencia de diagnóstico; no se afirma un árbol sin advertencias de herramientas. `npm ci` con el lockfile, auditoría y build/servidor/pruebas validan las versiones efectivamente instaladas. No ejecutar `npm audit fix --force` ni actualizar a otra versión mayor sin revisar compatibilidad.

## Para uso personal local

El usuario confirmó este alcance, sin despliegue empresarial por ahora. Ver [uso local personal](uso-local-personal.md). `npm run status:local`, con dev iniciado, comprueba API/BD, interfaz y proxy con lecturas HTTP locales. No valida login ni permisos y no inicia servicios.

## Ante un futuro despliegue empresarial

Esta entrega sigue siendo local. En el servidor elegido deben verificarse HTTPS y cookies Secure reales, proxy/IP de confianza, CORS/origen exacto, acceso MySQL mínimo y TLS si es remoto, almacenamiento privado de fotos y respaldo externo cifrado. Separar migrador con DDL del usuario de aplicación. Swagger se deshabilita con NODE_ENV production, pero eso solo no constituye un despliegue seguro.

El límite de login está en memoria y por IP de conexión; sin configuración de proxy todos los clientes de un reverse proxy pueden compartir cupo. No habilitar trust proxy indiscriminadamente: requiere conocer el proxy y su red. Una sola instancia actual; no asumir sesiones de límite distribuidas, SLAs, capacidad de múltiples servidores o monitoreo/alertas externo ya instalado.

Definir responsables, acceso de usuarios finales, política de sesiones/retención, RPO/RTO y procedimiento de actualización/retorno a versión anterior. Carga inicial confirmada: 50 autobuses y 10 usuarios simultáneos; repetir la referencia en destino. Las políticas no definidas no se inventan. Conservar evidencias y BD coherentes al actualizar. La revisión automatizada/teclado/320 px no sustituye pruebas con usuarios y lectores de pantalla reales.
