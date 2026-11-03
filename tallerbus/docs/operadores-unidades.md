# Operadores y autobuses autorizados

Cada operador puede tener varias unidades autorizadas. Al reportar una falla debe elegir una de esas unidades activas; no puede escribir otro económico. La comprobación también se realiza en el servidor.

## Primera asignación — Administración

1. En **Usuarios**, crea o localiza la cuenta con rol Operador.
2. Pulsa **Autobuses autorizados** en su fila. También puedes entrar por **Unidades de operadores** en el menú.
3. Busca por nombre de operador y abre **Gestionar unidades**.
4. Marca uno o varios autobuses activos. Busca por económico o placas; la selección se conserva al buscar o cambiar de página.
5. Escribe el motivo y pulsa **Guardar unidades autorizadas**.

La primera asignación requiere al menos una unidad y solo la hace Administración. Crear la cuenta no autoriza automáticamente ningún autobús. Una cuenta sin unidades puede entrar y consultar sus reportes anteriores, pero no enviar nuevos reportes.

## Cambiar unidades — Administración o Logística

En **Unidades de operadores**, localiza al operador y pulsa **Gestionar unidades**. Quita las que ya no le corresponden, marca las nuevas, indica el motivo y guarda.

Logística puede cambiar una asignación que Administración ya haya iniciado. No obtiene acceso a editar cuentas, contraseñas o roles. Si retiras todas las unidades, el operador queda sin permiso para reportar hasta que le autorices al menos una unidad activa.

Los cambios se verifican con una versión: si otra persona modifica la selección al mismo tiempo, se pide recargar en lugar de sobrescribirla. Se registra quién realizó el cambio, motivo y unidades anteriores/nuevas en auditoría.

## Reportar una falla — Operador

1. Abre **Mis reportes → Reportar falla**.
2. En **Autobús autorizado**, elige la unidad correspondiente. La selección es obligatoria en cada reporte, incluso si solo hay una opción.
3. Captura tipo y descripción y guarda. Después puedes adjuntar fotografías.

**Actualizar mis unidades** vuelve a consultar las autorizaciones. Si la unidad dejó de estar autorizada mientras tenías abierto el formulario, el servidor rechazará el envío; actualiza las opciones y solicita la reasignación al responsable.

Un autobús inactivo no aparece entre las opciones y no acepta nuevos reportes. Los mecánicos conservan el reporte de unidades activas para sus inspecciones, conforme a sus permisos actuales.

## Historial y cambios de rol

Reasignar unidades no mueve ni elimina fallas anteriores: cada reporte conserva autobús original, operador autor, estado y seguimiento. El operador continúa consultando sus propios reportes anteriores aunque ya no tenga esa unidad autorizada.

Cambiar el rol de una cuenta elimina sus autorizaciones de operador. Si vuelve a tener rol Operador, Administración debe iniciar una nueva asignación. Las fallas históricas siguen conservándose.

## Actualizar una instalación existente

Detén el servidor con Ctrl+C, abre Docker y ejecuta desde tallerbus:

```powershell
git pull --ff-only
npm.cmd run setup
npm.cmd run dev
```

Setup añade la tabla de autorizaciones y su control de versión, sin borrar usuarios ni reportes. **Administración debe asignar unidades a los operadores existentes**. No se deducen permisos a partir de fallas históricas ni se asigna toda la flota automáticamente.

En demostraciones nuevas se incluyen dos unidades ficticias autorizadas para el operador DEMO. Las demostraciones ya existentes conservan sus ediciones: usa Administración para configurar sus autorizaciones después de actualizar.
