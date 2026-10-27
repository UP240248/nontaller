# Acceso con usuario, sin correo — 27 de octubre de 2026

Las cuentas ahora tienen **nombre del empleado**, **usuario de acceso**, **contraseña**, rol y estado. El correo deja de ser un campo de cuenta y no se utiliza al entrar, registrar, editar o consultar perfil/usuarios. Administración ve por separado empleado, usuario, rol y estado, y puede buscar/editar esos datos. Se conserva el selector de rol para aplicar los permisos ya acordados.

La contraseña nueva admite **8–128 caracteres**. Se guarda solo su hash Argon2id; no se consulta en texto ni se devuelve por API, listados, auditoría o logs. Administración define la contraseña inicial al crear, pero no puede recuperar su texto posteriormente. No existe recuperación por correo ni servicio de mensajería vinculado a cuentas. No se ha añadido un procedimiento de restablecimiento de contraseña en este cambio.

## Elegir un usuario

Entre 3 y 40 caracteres; comienza con letra o número y puede incluir letras sin acentos, números, punto, guion y guion bajo. Ejemplos: `juan.perez`, `mecanico1`, `logistica`. Se recorta espacio exterior y se guarda en minúsculas; ` JUAN.PEREZ ` y `juan.perez` son el mismo usuario. No se permiten espacios interiores ni @. El nombre del empleado sí admite espacios y acentos, entre 2 y 100 caracteres.

## Actualizar una instalación existente en Windows

Detén dev/demo con Ctrl+C y deja Docker abierto. Desde la carpeta tallerbus:

```powershell
git pull --ff-only
npm.cmd run db:local
npm.cmd run backup:local -- --offline
```

Verifica la copia mediante `npm.cmd run backup:verify -- "RUTA_MOSTRADA"` antes de continuar. No uses el comando de respaldo de datos personales con una configuración demo. Después:

```powershell
npm.cmd run setup
npm.cmd run users:local
npm.cmd run dev
```

`users:local` muestra usuario, empleado, rol y activo, nunca contraseñas. Usa el usuario mostrado y **tu contraseña anterior**, que se conserva. No vuelvas a crear el administrador ni borres .local/volúmenes. El navegador debe recargar la versión nueva; vuelve a iniciar sesión si tienes una página antigua abierta.

## Migración de cuentas

La séptima migración `20261027190000_usernames` crea usernames únicos a partir de la parte anterior al @ de la antigua cuenta: minúsculas, solo caracteres permitidos y hasta 24 caracteres para el nombre migrado habitual. Los nuevos usuarios creados desde la UI sí admiten hasta 40. Si la base original no resulta válida se usa `usuario`. Si hay colisiones, la primera cuenta por fecha/ID conserva ese nombre y las demás reciben `u_` más su UUID sin guiones. Consulta siempre users:local para saber el resultado exacto, especialmente si había cuentas con prefijos repetidos.

Se conservan IDs, nombre, hashes, rol, activación, versión, sesiones y relaciones históricas. La columna de correo de User se elimina; los respaldos anteriores y la auditoría histórica pueden contener ese dato antiguo y siguen siendo privados. No se reescribe historia ni se publican esos respaldos. Esta es una migración de esquema: no intentes volver al código viejo sin revisar compatibilidad de base.

Al editar un usuario de acceso desde la aplicación se revocan sus sesiones, igual que al cambiar el rol; debe volver a entrar con el identificador nuevo. Los permisos de módulos no se amplían con este cambio.

## Demo y cuentas de desarrollo

Si usas la demo, ejecuta `npm.cmd run demo:setup` y luego `npm.cmd run demo`. Su base independiente se migra y `.local/demo-accounts.json` se actualiza para contener `username` en lugar de `email`, sin cambiar contraseñas ni datos ficticios. Consulta ese archivo solo en tu equipo con Notepad. Los usuarios demo son `administracion`, `logistica`, `mecanico`, `operador` y `contabilidad`.

`seed:dev` también reconoce cuentas anteriores y actualiza únicamente su archivo privado tras comprobar que coinciden con la BD migrada. No se usa para reemplazar una instalación con usuarios propios.

El correo opcional de contacto de proveedores es un dato comercial independiente del acceso; los permisos de contactos siguen restringidos a Logística.

## Validación realizada

Se aprobaron lint, typecheck, compilación, 13 unitarias, 121 integraciones (incluida migración aislada) y 20 E2E; además, seis comprobaciones de demo. El recorrido de navegador crea una cuenta sin campo de correo, con contraseña de exactamente ocho caracteres, entra con ella y comprueba su gestión por Administración. La migración se ensayó con prefijos repetidos, inválidos y largos y conservó IDs, hashes, roles, versiones, sesiones e historial.

La primera variante del SQL usaba una tabla temporal y falló en la base de prueba por falta de ese permiso. Se sustituyó por una consulta derivada con ventana, sin ampliar privilegios. Se retiró únicamente la columna parcial de esa prueba y se repitieron satisfactoriamente la migración y las integraciones. La migración final se aplicó al desarrollo local después de respaldar; las huellas de las cinco cuentas confirmaron conservación exacta de nombre, hash, rol, activación y versión. La demo también se migró, sin cambiar sus contraseñas.

Los resultados son del entorno Linux de desarrollo; no se afirma una ejecución automática en la laptop Windows del usuario. No se han enviado contraseñas a logs ni a este documento.
