# Manual de usuario — Fases 1–3

## Ingresar y salir

Usa el correo y contraseña proporcionados por Administración. Un error de credenciales no indica si existe la cuenta; tras demasiados intentos espera antes de reintentar. Si no tienes acceso, contacta a Administración. No existe recuperación por correo en esta fase.

Mi espacio muestra tu nombre, correo, rol y estado consultados al servidor. La sesión se restaura al recargar, expira según configuración y puede ser revocada. «Cerrar sesión» invalida la sesión en el servidor. Si Administración cambia tu rol o desactiva tu cuenta, deberás autenticarte de nuevo o solicitar activación.

## Administración

En Usuarios puedes buscar por nombre/correo, filtrar por rol y recorrer páginas. «Crear usuario» requiere nombre, correo único, rol y contraseña inicial de 12–128 caracteres. Comparte la contraseña por un canal seguro. «Editar» cambia nombre, correo o rol. El cambio de rol cierra las sesiones previas.

«Desactivar» y «Activar» requieren confirmación; no eliminan historial. Desactivar cierra sesiones y bloquea nuevos accesos. «Revocar sesiones» cierra todos los accesos vigentes del usuario. No es posible desactivar ni cambiar el rol al último administrador activo. Si otra persona editó la cuenta, actualiza la lista antes de reintentar.

En Auditoría se registran accesos, cierres de sesión, altas, ediciones y revocaciones, con actor y fecha UTC. No contiene contraseñas ni tokens. La tabla tiene paginación y actualización.

## Otros roles

En Fase 1 los cuatro roles no administrativos consultaban solo su perfil. Fase 2 amplía flota para Logística y Mecánico; En Fase 3 Operador también reporta fallas y consulta sus propios reportes; Contabilidad sigue solo con perfil. No tienen acceso a usuarios, auditoría, datos financieros ni módulos de flota todavía. Los módulos futuros se habilitarán cuando sus permisos y reglas se validen.

## Autobuses y dashboard

Administración y Logística pueden registrar unidades desde Autobuses, con número económico y placas únicos, marca, modelo, kilometraje y estado inicial elegido explícitamente. Las placas se guardan sin espacios/guiones y en mayúsculas. No pueden registrarse dos unidades con las mismas placas canónicas. No se cargan autobuses ficticios automáticamente.

El listado permite búsqueda, filtro de activo y estado, orden y páginas. Abrir el económico lleva al detalle. «Editar datos» requiere motivo; un cambio concurrente muestra conflicto y ofrece recargar, sin sobrescribir a otra persona.

Administración y Logística pueden activar/desactivar con confirmación. Se conserva unidad e historial; no equivale a poner en reparación ni a habilitar. Los tres roles, incluido Mecánico, pueden cambiar estado operativo con confirmación y motivo. Mecánico no ve controles de edición general ni de activación.

Historial muestra responsable, UTC, motivo y datos anteriores/nuevos. El dashboard cuenta datos reales: disponibles = activos HABILITADO; taller = activos EN_REPARACION o EN_ESPERA_REFACCIONES. Activos/inactivos son clasificación administrativa, independiente del estado. La distribución por estado incluye todas las unidades. Fase 3 añade las fallas abiertas; mantenimiento y costos siguen para fases posteriores.

## Reportar y seguir una falla

Operador y Mecánico pueden usar «Reportar falla»: escribe el económico de una unidad activa conocida, tipo y descripción. La fecha y autor se registran automáticamente. No es necesario decidir prioridad; la confirma un Mecánico. El operador solo ve sus reportes, sin catálogo completo de flota ni órdenes internas.

Después de guardar puedes adjuntar fotos PNG/JPEG de hasta 5 MB y descargarlas desde el detalle. Un archivo con extensión falsa, tipo incompatible o contenido alterado se rechaza. Evita datos personales en las fotos y narrativas. No se publica una URL abierta.

Mecánico evalúa prioridad y escribe evaluación/motivo. Administración y Logística consultan seguimiento y coordinan órdenes. Los filtros combinan unidad, tipo, prioridad, estado y fechas UTC. Mecánico puede usar «Solo mis fallas asignadas» o «Solo mis órdenes» para enfocarse en sus trabajos. El historial registra responsables y acciones.

## Crear y asignar una orden

Administración o Logística entra a Órdenes, «Crear orden», consulta el económico y selecciona una o varias fallas evaluadas, pendientes y sin orden. Todas deben corresponder al mismo autobús. Indica título y guarda; después selecciona mecánicos activos, motivo y «Guardar asignación». Los cambios de turno conservan la asignación anterior en el historial.

El mecánico asignado abre la orden e inicia trabajo indicando diagnóstico y motivo. Las fallas pasan juntas a En proceso. Puede registrar espera de refacciones o terminarla sin añadir estados nuevos a la falla. El estado operativo del autobús se cambia por separado, según los permisos de flota.

## Finalizar reparación

El mecánico asignado selecciona «Finalizar reparación» y registra trabajo, observaciones, si aplicó mano de obra y sus minutos, si utilizó refacciones y sus descripciones/cantidades/unidades, y motivo. No hay precios o stock en este formulario. Solo se confirma con datos coherentes. El servidor registra responsable y fecha UTC y finaliza orden y fallas vinculadas en una única operación.

Una orden finalizada no puede reabrirse, reasignarse ni finalizarse de nuevo. No habilita automáticamente el autobús. Por decisión aprobada, las fallas abiertas tampoco impiden que un rol autorizado lo habilite manualmente. Si hay un conflicto de versión, recarga el detalle antes de reintentar; no se sobrescribe el trabajo de otra persona.
