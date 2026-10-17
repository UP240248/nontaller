# Manual de usuario — Fases 1 y 2

## Ingresar y salir

Usa el correo y contraseña proporcionados por Administración. Un error de credenciales no indica si existe la cuenta; tras demasiados intentos espera antes de reintentar. Si no tienes acceso, contacta a Administración. No existe recuperación por correo en esta fase.

Mi espacio muestra tu nombre, correo, rol y estado consultados al servidor. La sesión se restaura al recargar, expira según configuración y puede ser revocada. «Cerrar sesión» invalida la sesión en el servidor. Si Administración cambia tu rol o desactiva tu cuenta, deberás autenticarte de nuevo o solicitar activación.

## Administración

En Usuarios puedes buscar por nombre/correo, filtrar por rol y recorrer páginas. «Crear usuario» requiere nombre, correo único, rol y contraseña inicial de 12–128 caracteres. Comparte la contraseña por un canal seguro. «Editar» cambia nombre, correo o rol. El cambio de rol cierra las sesiones previas.

«Desactivar» y «Activar» requieren confirmación; no eliminan historial. Desactivar cierra sesiones y bloquea nuevos accesos. «Revocar sesiones» cierra todos los accesos vigentes del usuario. No es posible desactivar ni cambiar el rol al último administrador activo. Si otra persona editó la cuenta, actualiza la lista antes de reintentar.

En Auditoría se registran accesos, cierres de sesión, altas, ediciones y revocaciones, con actor y fecha UTC. No contiene contraseñas ni tokens. La tabla tiene paginación y actualización.

## Otros roles

En Fase 1 los cuatro roles no administrativos consultaban solo su perfil. Fase 2 amplía flota para Logística y Mecánico; Operador y Contabilidad siguen solo con su perfil. No tienen acceso a usuarios, auditoría, datos financieros ni módulos de flota todavía. Los módulos futuros se habilitarán cuando sus permisos y reglas se validen.

## Autobuses y dashboard

Administración y Logística pueden registrar unidades desde Autobuses, con número económico y placas únicos, marca, modelo, kilometraje y estado inicial elegido explícitamente. Las placas se guardan sin espacios/guiones y en mayúsculas. No pueden registrarse dos unidades con las mismas placas canónicas. No se cargan autobuses ficticios automáticamente.

El listado permite búsqueda, filtro de activo y estado, orden y páginas. Abrir el económico lleva al detalle. «Editar datos» requiere motivo; un cambio concurrente muestra conflicto y ofrece recargar, sin sobrescribir a otra persona.

Administración y Logística pueden activar/desactivar con confirmación. Se conserva unidad e historial; no equivale a poner en reparación ni a habilitar. Los tres roles, incluido Mecánico, pueden cambiar estado operativo con confirmación y motivo. Mecánico no ve controles de edición general ni de activación.

Historial muestra responsable, UTC, motivo y datos anteriores/nuevos. El dashboard cuenta datos reales: disponibles = activos HABILITADO; taller = activos EN_REPARACION o EN_ESPERA_REFACCIONES. Activos/inactivos son clasificación administrativa, independiente del estado. La distribución por estado incluye todas las unidades. Fallas abiertas, mantenimiento y costos llegarán en fases posteriores.
