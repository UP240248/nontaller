# Respaldos y restauración local

Se dispone de helpers para **MySQL local del proyecto** (`tallerbus`/`tallerbus_test`, Docker y puerto 3307). El ensayo restaura siempre en una base temporal nueva y una carpeta privada nueva; no reemplaza bases ni evidencias existentes. No es un procedimiento de recuperación productiva ni almacenamiento externo automático.

## Crear una copia consistente

Detén la API y cualquier otro proceso/persona que escriba en la base o evidencia. Después, desde `tallerbus/`:

```sh
npm run db:local
npm run backup:local -- --offline
```

`--offline` declara esa parada de escritores; no es una orden para detener servicios automáticamente. El helper rechaza un listener en el puerto API configurado y compara el contenido completo de tablas antes/después del dump; no puede garantizar ausencia de otros escritores externos. No usar durante migraciones/DDL. Si informa cambios, no considerar completo el intento y repetir en mantenimiento real.

El comando informa la carpeta `.local/backups/FECHA-UUID/`. Contiene `database.sql`, `manifest.json` y `evidence/`. Copia todas las tablas, incluida auditoría/migraciones/sesiones, y todas las evidencias UUID PNG/JPEG regulares, incluidas las huérfanas; no elimina originales. Manifiesto con SHA-256 del SQL/fotos, recuentos y hash canónico de cada tabla por clave primaria. Una falta o corrupción de foto referenciada impide dar el respaldo por completo. Nombres inesperados, enlaces y archivos especiales se rechazan para revisión, sin borrarlos.

Archivos 0600 y directorios privados en este entorno Linux. El dump contiene hashes de contraseña/sesión y datos internos: no compartirlo en chat, Git ni carpetas públicas. No está cifrado por estos helpers y vive en el mismo entorno: debe trasladarse a almacenamiento externo cifrado y con acceso restringido según la política que defina Terrabus. Hashes detectan cambios respecto de un manifiesto confiable; no autentican un paquete de origen desconocido.

## Verificar restauración sin reemplazar datos

```sh
npm run backup:verify -- .local/backups/FECHA-UUID
```

Usar solo respaldos propios/confiables. La verificación:

1. Valida manifiesto, SQL y evidencia antes de crear recursos temporales.
2. Crea base `tallerbus_restore_UUID` y cuenta exclusiva, con permisos solo sobre esa base; nunca importa como root ni concede acceso a la base original.
3. Importa SQL y copia fotografías a `.local/restore-check/UUID/`.
4. Concilia todas las filas/contenidos por tabla, las FK simples/compuestas y cada foto referenciada por tamaño/hash. Concilia saldos/valores con el ledger de movimientos.
5. Revoca todas las sesiones activas **en la copia**. La base original conserva sus sesiones y datos.
6. Elimina base/cuenta/carpetas y credenciales temporales propias. Si falla la limpieza lo informa como error; no declara éxito parcial. Una interrupción brusca del proceso puede requerir revisar recursos temporales, sin borrar objetos ajenos.

El resultado muestra cantidades, relaciones comprobadas, saldos conciliados y sesiones revocadas, sin contraseñas/contenido privado. La restitución real de una aplicación debe revocar sesiones restauradas y exigir nuevo login, para no recuperar accesos anteriores al incidente. Este helper solo demuestra esa operación en la copia aislada; no realiza el cambio de servicio.

Las pruebas incluyen corrupción SQL/fotos, enlaces, relación rota heredada y un SQL con checksum recalculado que intenta leer la base original: la cuenta temporal lo rechaza y conserva el origen. Un dump sin este ensayo no se considera recuperación demostrada.

## Recuperación efectiva y políticas pendientes

No hay comando que sobrescriba la base existente. Ante un incidente, conserva el origen y sus archivos, detén todos los escritores, verifica una copia aislada, acuerda el punto de recuperación y configura el servicio hacia una base/carpeta restaurada revisada. Valida login/permisos, fotos, costos/auditoría y revocación de sesiones antes de volver a abrir acceso. La separación de usuario migrador/ejecución y el cambio de destino productivo requieren el entorno definitivo.

Terrabus debe definir responsable, frecuencia, retención, cifrado/claves, medio externo, RPO y RTO. No se inventan SLAs ni una frecuencia comercial. El ensayo local, el snapshot cloud y un volumen Docker no prueban disponibilidad de una copia externa ni restauración en otra máquina. Windows, proveedor definitivo, recuperación externa y retención quedan por validar allí. Nunca automatizar borrado de huérfanos o volúmenes como reparación.
