# Uso local personal de TallerBus

## Alcance confirmado

El usuario confirmó que, por ahora, lo usará personalmente en su equipo. Existe un servidor interno de la empresa, pero no forma parte de esta entrega. No se necesita dominio ni publicar la aplicación en la red empresarial para este alcance. La referencia de capacidad probada sigue siendo 50 autobuses y 10 usuarios; el uso personal no añade permisos al rol de Administración.

Esta guía se ejecuta en el equipo donde usarás TallerBus. Que funcione en el entorno cloud de desarrollo no instala automáticamente la aplicación en tu computadora. Validado en Linux con Node 24.19.0, npm 11.9.0 y Docker; Windows/WSL2 está documentado en despliegue-local, pero no probado aquí.

## Primera instalación

Con Git, Node y Docker instalados y Docker activo, descarga el repositorio `UP240248/nontaller`, rama `main`, y abre una terminal dentro de `nontaller/tallerbus`:

```sh
npm ci
npm run setup
npm run bootstrap
```

`bootstrap` pide tus datos y contraseña oculta en la terminal; crea solo el primer administrador. Si ya existe uno, utiliza esa cuenta: no borres la base para repetirlo. Se solicita usuario de acceso, nombre del empleado y contraseña de 8–128 caracteres; no se pide correo. No pegues contraseñas en el chat ni las incluyas en comandos.

Para usar módulos operativos, Administración puede crear cuentas propias con los roles correspondientes. Logística gestiona inventario, compras y planes; Mecánico ejecuta reparaciones y preventivos; Operador reporta fallas; Contabilidad consulta reportes financieros. Cada cuenta tiene un rol. No hay una cuenta con todos los permisos ni un cambio automático de rol; Administración continúa sin importes financieros. Consulta el manual de usuario para los flujos.

No ejecutes `seed:dev` para empezar tus datos personales: crea cuentas ficticias de demostración. No se incorporan autobuses ni inventario automáticamente.

## Cada vez que lo uses

Arranca Docker y, desde `tallerbus/`:

```sh
npm run dev
```

Deja esa terminal abierta. En otra terminal de la misma carpeta:

```sh
npm run status:local
```

Deben salir tres comprobaciones OK: API/MySQL, interfaz y proxy. El comando solo hace lecturas de salud; no crea usuarios, no inicia servicios ni modifica la BD. Comprueba también login y acceso a los módulos que corresponden a tu rol. No acredita autenticación ni permisos por sí solo.

En tu propio equipo abre el navegador con hostname **localhost** y puerto **4200**, usando HTTP. Evita cambiar a la IP del equipo: el origen de cookies está configurado para localhost. API y MySQL están limitados a loopback. Conserva también el frontend en localhost: no uses opciones para escuchar en todas las interfaces, túneles ni reenvío de puertos para este alcance. No cambies el firewall de la empresa.

## Detener y respaldar

1. Cierra sesión y detén `npm run dev` con Ctrl+C. Detén también cualquier otro proceso que escriba datos.
2. Mantén MySQL activo y ejecuta:

```sh
npm run backup:local -- --offline
```

3. Usa la ruta concreta mostrada por ese comando para comprobar la copia:

```sh
npm run backup:verify -- "RUTA_MOSTRADA"
```

4. Después puedes detener MySQL: `docker stop tallerbus-mysql-local`.

La verificación restaura en una base temporal nueva y la elimina; no reemplaza tu base. Si necesitas recuperar datos reales, conserva el original y solicita un procedimiento específico antes de reemplazar nada. Más detalle en [Respaldos](respaldos.md).

Los datos persisten al cerrar la aplicación y detener el contenedor. No borres el volumen Docker ni uses comandos de limpieza de volúmenes: el repositorio Git no contiene tus datos. La carpeta `.local/backups` está en el mismo equipo y sus copias no están cifradas; una avería del disco puede perder original y respaldo. Guarda una copia protegida fuera del equipo con una herramienta de cifrado de confianza antes de depender de datos importantes. No publiques copias ni `.local/` en Git o chats. La frecuencia y retención no se fijan sin tu decisión.

## Actualizar sin perder datos

Detén la aplicación, crea y verifica una copia primero. Con el checkout limpio y sin cambios propios pendientes, ejecuta `git pull --ff-only` en `main`, seguido de `npm ci` y `npm run setup`. Si Git informa conflictos o divergencias, detente y conserva tus cambios; no uses reset ni force. Vuelve a iniciar y comprobar con `status:local`. No intentes volver a una versión anterior sobre una BD migrada sin revisar compatibilidad.

## Si algo falla

| Resultado | Qué revisar |
|---|---|
| Docker no responde | Abrir Docker y esperar a que esté listo; repetir db:local |
| API/MySQL falla | Terminal de dev, puerto 3000 libre y db:local; nunca regenerar secretos o borrar volumen |
| Interfaz falla | Terminal de dev y puerto 4200 libre; usar la carpeta correcta |
| Proxy falla | API activa y configuración original de frontend; no cambiar permisos de cookies |
| No inicia sesión | Cuenta creada por bootstrap, usuario, contraseña y límite temporal de intentos; no borrar la BD |
| Un módulo no aparece | Revisar el rol de la cuenta; es una restricción de acceso |

## Cierre de la fase 7 local

El cierre técnico local incluye pruebas automatizadas, referencia de carga, respaldo/restauración aislada, revisión de teclado/pantalla estrecha y comprobación de arranque. Queda tu aceptación en el equipo donde vas a usarlo. El despliegue empresarial, HTTPS público, servidor interno y aceptación productiva se retoman únicamente si decides ampliar el alcance; no bloquean la entrega local personal ni se consideran realizados.

Para una versión anterior con acceso por correo, sigue [migración a usuario](acceso-por-usuario.md) y consulta `npm run users:local` después de actualizar.

### Arranque actualizado

El lanzador `dev` ya incluye db:local y una consulta SQL previa con la cuenta de la aplicación. Tras actualizar esta versión, cada inicio solo necesita Docker Desktop listo y `npm run dev`; para demo, `npm run demo`. Ver [arranque después de reiniciar](arranque-tras-reinicio.md). Si falla la comprobación no se abre la interfaz.
