# Validación de Fase 7 — consolidación local

Fecha: 20 de octubre de 2026. Node 24.19.0, npm 11.9.0, MySQL 8.4 en Docker local y Chromium del entorno. Las seis migraciones existentes permanecen sin cambios. La entrega consolida las fases 1–6; no incorpora nuevas reglas comerciales ni amplía permisos.

## Comprobaciones ejecutadas

`npm ci` completado con lockfile; `npm run setup` repetido correctamente después de la suite completa. `npm run check` terminó con código 0: lint, typecheck, compilación backend/frontend, **8 unitarias, 118 de integración MySQL y 20 E2E** aprobadas, sin pruebas omitidas. Total: **146**. Las bases de pruebas están aisladas de desarrollo y los recorridos verifican autorización y flujos reales.

Se cubren origen/CSRF, cookies y revocación, límites de login, errores sin detalles internos, cuerpos excesivos con 413 y comparación de tokens con caracteres Unicode. La configuración productiva de cookies Secure y Swagger deshabilitado se prueba localmente; no demuestra terminación HTTPS real.

`npm audit` completo: **0 vulnerabilidades conocidas** al validar, frente a cuatro paquetes afectados inicialmente en herramientas de desarrollo. Vite 7.3.7 y SDK 1.32.0 se fijan mediante overrides, manteniendo Angular 21.2.27. `npm ls` devuelve ELSPROBLEMS por los pines transitivos originales de Angular frente a esos overrides en npm 11.9; la instalación, auditoría, build y servidor ejercitado por E2E funcionan. Ver operación para el seguimiento de esta limitación.

## Arranque y recuperación

Se reinició el contenedor local propio y se ejecutó `npm run db:local`; las conexiones a desarrollo y pruebas funcionaron con caché de autenticación fría. La clave pública RSA se obtiene del contenedor local identificado, se valida y se fija en configuración privada; no se habilita recuperación de claves desde servidores de red. Esto no cifra consultas de una BD remota.

Se ejecutaron realmente `npm run backup:local -- --offline` y `npm run backup:verify -- RUTA` sobre desarrollo: **24 tablas, 24 filas, 37 relaciones verificadas, una sesión revocada únicamente en copia**, sin fotos ni saldos en esa base. La base original permaneció intacta y la base temporal fue eliminada.

Ocho pruebas de recuperación independientes verifican datos con fotografías, archivos huérfanos y saldos no nulos, conciliación de movimientos, detección de alteraciones SQL/fotos, rechazo de enlaces simbólicos y relaciones rotas, privilegios limitados de importación y limpieza de recursos propios. No se publica SQL ni configuración privada.

La copia local no está cifrada ni almacenada fuera del equipo. El procedimiento exige detener escritores y paquetes propios confiables; no ofrece restauración sobre datos existentes. No se ha probado recuperación de un servidor productivo perdido.

## Carga inicial acordada

El usuario confirmó hasta **50 autobuses y 10 usuarios simultáneos**. `npm run test:load` ejecutó ese escenario con diez sesiones de los cinco roles, 250 órdenes, 500 fallas y consultas a siete rutas de métricas/reportes. Tras calentamiento, registró:

| Medida | Resultado local |
|---|---:|
| Consultas medidas | 200 |
| Errores | 0 |
| p50 | 34,51 ms |
| p95 | 65,05 ms |
| p99 | 74,36 ms |
| Tiempo medido | 759,55 ms |
| Consultas/segundo | 263,32 |

Es una referencia breve de lecturas HTTP locales con caché caliente, no un SLA ni una prueba prolongada o de escritura concurrente. Debe repetirse en la infraestructura definitiva. Los fixtures se crean exclusivamente en tallerbus_test, sin ejecución simultánea con integración/E2E.

## Accesibilidad y límites de cierre

E2E comprueba acceso por teclado, salto al contenido, diálogo modal, Escape con restauración de foco, desplazamiento de tablas y ausencia de desbordamiento global a 320 px; incluye análisis axe. No equivale a certificación WCAG 2.2 AA ni reemplaza revisión con lectores de pantalla y usuarios finales.

La consolidación local está validada. El cierre productivo de Fase 7 requiere servidor definido, HTTPS/proxy, TLS y privilegios mínimos de BD remota, respaldo externo cifrado y prueba de recuperación allí, frecuencia/retención/RPO/RTO/responsables acordados, rendimiento en destino y aceptación manual. Publicar Git no despliega la aplicación ni publica el entorno cloud.

## Continuación: uso personal local

El usuario aclaró que no desplegará en la red empresarial por ahora. Se preparó la guía de uso personal y `npm run status:local`, que valida destinos loopback, no sigue redirecciones y comprueba salud API/BD, interfaz y proxy con lecturas HTTP. Lint y 13 pruebas unitarias aprobados (8 previas y 5 nuevas de estado local); no se repitieron integración/E2E porque no cambió la lógica de aplicación. El resultado de 146 pruebas de la sección anterior pertenece a la validación completa previa; no se afirma una nueva ejecución completa de 151 pruebas.

La preparación productiva sigue sin realizarse y queda fuera del alcance actual; el pendiente para uso personal es su instalación/aceptación en el equipo del usuario.

El diagnóstico se ejecutó además contra los servicios reales de desarrollo: con aplicaciones detenidas devolvió código 1 y tres comprobaciones fallidas, como se esperaba. Tras `npm run db:local` y `npm run dev`, devolvió código 0 y las tres comprobaciones OK. No se modificaron datos comerciales ni se crearon cuentas para esta verificación.
