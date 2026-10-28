# Arranque después de reiniciar la computadora — 28 de octubre de 2026

## Problema corregido en el código

Abrir Docker Desktop no garantiza que el contenedor de MySQL esté activo ni que SQL ya acepte conexiones. Antes, `dev` y `demo` lanzaban API/interfaz directamente; el arranque no preparaba MySQL. Además, Prisma podía crear el pool sin demostrar aún una consulta SQL real, permitiendo descubrir el fallo posteriormente como un error interno de health/login.

No se ha inspeccionado la laptop del usuario: un error 500 también puede tener otras causas. Esta corrección aborda el arranque local, lo comprueba antes de servir la interfaz y proporciona un mensaje de diagnóstico si no se completa.

## Nuevo comportamiento

`npm run dev` y `npm run demo` usan el mismo lanzador local:

1. Comprueba API compilada y preparación previa del modo elegido.
2. Verifica que Docker responda, reconoce únicamente el contenedor del proyecto por su etiqueta, inicia MySQL y espera SQL.
3. Refresca la clave RSA pública desde ese contenedor conocido, conservando contraseñas y configuraciones existentes.
4. Lee la configuración privada del modo correspondiente, comprueba que BD/puertos/origen sean coherentes y la pasa explícitamente a los procesos.
5. Ejecuta una consulta SQL real con **la cuenta de aplicación** y comprueba el esquema de usuarios antes de iniciar servidores. No basta con que root pueda conectarse.
6. Solo entonces abre API/interfaz con concurrently. Si un paso falla, se detiene antes de abrir la interfaz y da una instrucción, sin imprimir claves.

La API también ejecuta SELECT 1 durante su inicialización, incluso si se arranca directamente con dev:api/demo:api. Así no comienza a escuchar si falla esa consulta inicial. No se añade recuperación automática de claves por red ni se cambia la política de sesiones.

El contenedor propio usa `unless-stopped`: al reabrir Docker puede reanudarse si no se había detenido expresamente. El lanzador lo inicia también si estaba detenido. No controla el arranque de Docker Desktop ni necesita exponer puertos fuera de loopback.

## Actualizar una sola vez en Windows

Abre Docker Desktop, espera motor activo y detén TallerBus con Ctrl+C. Desde la carpeta de tu instalación:

```powershell
git pull --ff-only
npm.cmd run setup
npm.cmd run dev
```

Si ya usas la demo preparada, usa `npm.cmd run demo` en el último paso. No necesitas ejecutar bootstrap ni generar otro administrador. Conserva tus respaldos y no elimines .local o volúmenes. setup aplica cualquier migración pendiente y compila, por lo que se mantiene la política general de respaldar/verificar antes de actualizar una instalación con datos importantes.

## Cada mañana

1. Abre Docker Desktop y espera a que indique que su motor está activo.
2. Abre una terminal en tallerbus y ejecuta **npm.cmd run dev**, o **npm.cmd run demo** para la demostración.
3. Espera los pasos 1/3, 2/3 y 3/3; deja la terminal abierta.
4. Abre localhost:4200 para tus datos o localhost:4202 para demo (en InPrivate si alternas modos).

Ya no es necesario recordar db:local como paso separado del arranque habitual. Los comandos técnicos individuales siguen existiendo para diagnóstico. No se ejecutan semillas, bootstrap o migraciones automáticamente al abrir la aplicación.

## Si se detiene

- **Docker Desktop no está listo:** abrirlo, esperar y repetir dev/demo. La interfaz no se inicia hasta completar la comprobación.
- **Falta compilar/preparar:** completar setup o demo:setup según el caso, sin borrar nada.
- **No pudo verificar MySQL con la cuenta de aplicación:** conservar .local, confirmar que se trabaja desde la misma copia y revisar credenciales/clave pública/esquema con soporte. No resetear contraseñas SQL ni crear otro administrador para resolverlo.
- **Configuración incompatible:** desarrollo corresponde a tallerbus y 3000/4200; demo a tallerbus_demo y 3002/4202, ambos MySQL local 3307. No se modifica una configuración diferente automáticamente.
- **Puerto ocupado:** cerrar únicamente la instancia propia previa y reintentar; no detener procesos ajenos.

Para pedir ayuda, compartir los pasos y mensajes de la terminal sin archivos .local, contraseñas, cookies ni SQL. El lanzador verifica el arranque; no garantiza que una base que se detenga después vaya a seguir respondiendo. Si se cierra Docker mientras TallerBus está abierto, detener la app y reabrirla una vez vuelva el motor.

## Evidencia

En Linux se detuvo expresamente el contenedor propio y se ejecutó el lanzador de desarrollo; se repitió con demo. En ambos modos se verificaron conexión SQL, health API, health vía proxy de frontend y HTML Angular. Las huellas de todas las tablas permanecieron iguales y se conservaron los archivos de credenciales. Se comprobó además que una contraseña SQL deliberadamente errónea falla sin revelar su valor. El cierre de los procesos de prueba también se ejercitó.

Las unitarias comprueban separación de configuraciones, rechazo de destinos remotos/pruebas y fallo sin apertura de interfaz cuando Docker no responde. No se ha reiniciado físicamente la laptop Windows del usuario; esa confirmación sigue pendiente de instalar la actualización.

Además del ensayo de arranque detenido se aprobaron lint, typecheck y compilación backend; 16 unitarias, 121 integraciones y 3 E2E de fundamentos (140 pruebas, sin omitidas en estas ejecuciones). Las integraciones y los E2E se ejecutaron secuencialmente sobre tallerbus_test. No se repitieron las pruebas visuales del dashboard porque no se modificó la interfaz.
