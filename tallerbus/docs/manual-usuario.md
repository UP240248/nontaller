# Manual de usuario — Fases 1–3

## Ingresar y salir

Usa el correo y contraseña proporcionados por Administración. Un error de credenciales no indica si existe la cuenta; tras demasiados intentos espera antes de reintentar. Si no tienes acceso, contacta a Administración. No existe recuperación por correo en esta fase.

Mi espacio muestra tu nombre, correo, rol y estado consultados al servidor. La sesión se restaura al recargar, expira según configuración y puede ser revocada. «Cerrar sesión» invalida la sesión en el servidor. Si Administración cambia tu rol o desactiva tu cuenta, deberás autenticarte de nuevo o solicitar activación.

## Administración

En Usuarios puedes buscar por nombre/correo, filtrar por rol y recorrer páginas. «Crear usuario» requiere nombre, correo único, rol y contraseña inicial de 12–128 caracteres. Comparte la contraseña por un canal seguro. «Editar» cambia nombre, correo o rol. El cambio de rol cierra las sesiones previas.

«Desactivar» y «Activar» requieren confirmación; no eliminan historial. Desactivar cierra sesiones y bloquea nuevos accesos. «Revocar sesiones» cierra todos los accesos vigentes del usuario. No es posible desactivar ni cambiar el rol al último administrador activo. Si otra persona editó la cuenta, actualiza la lista antes de reintentar.

En Auditoría se registran accesos, cierres de sesión, altas, ediciones y revocaciones, con actor y fecha UTC. No contiene contraseñas ni tokens. La tabla tiene paginación y actualización.

## Otros roles

En Fase 1 los cuatro roles no administrativos consultaban solo su perfil. Fase 2 amplía flota para Logística y Mecánico; En Fase 3 Operador también reporta fallas y consulta sus propios reportes; Contabilidad sigue solo con perfil. Solo Administración gestiona usuarios y auditoría. Logística y Mecánico acceden a flota según sus permisos; Fase 4 habilita costos/operación de inventario únicamente para Logística. Los demás módulos futuros requieren sus reglas.

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

## Inventario y compras — Logística

En **Refacciones** registra el SKU, descripción, unidad, categoría opcional y mínimo. Las cantidades admiten hasta tres decimales con punto. En **Proveedores** registra código, nombre y contactos opcionales. Editar o activar/desactivar exige motivo y conserva historial. Una unidad de medida con movimientos o compras queda fija: registra otra pieza si necesitas otra unidad.

En **Inventario** consulta existencias y alertas de mínimo. La búsqueda por SKU/descripción filtra existencias y actualiza las opciones de piezas activas en formularios. Para catálogos grandes usa una búsqueda específica; cada selección carga hasta 100 coincidencias, mientras las tablas tienen paginación de 20 registros. Administración y Mecánico consultan cantidades sin importes; solo Logística ve valoración y operaciones.

- **Entrada directa:** indica pieza, cantidad positiva, costo unitario en MXN y comprobante/motivo. Úsala para ingresos que no provengan de una compra registrada, por ejemplo saldo inicial respaldado; no repitas una recepción como entrada directa.
- **Entrega a orden:** busca la orden, selecciona pieza/cantidad e indica motivo. La existencia baja inmediatamente al entregar; si falta stock, la operación se rechaza completa. No se entregan piezas a órdenes finalizadas.
- **Devolución:** en el historial localiza la entrega y pulsa «Devolver de esta entrega». Indica la cantidad no utilizada y motivo. Se repone su costo original, no el precio actual. No se puede devolver más de lo entregado sin devolver. Puede registrarse después del cierre y conserva su historia.
- **Ajuste:** cantidad con signo y motivo del conteo. Los ajustes usan el promedio vigente y no pueden dejar stock negativo. Para incorporar piezas sin promedio previo registra una entrada con costo.

Para comprar, elige proveedor activo, referencia y una o varias partidas de piezas distintas, con cantidades y costos unitarios MXN (hasta seis decimales). Guarda el borrador; este aún no altera existencias. Revisa el detalle, escribe motivo y pulsa **Aprobar compra**. Logística puede aprobar sus propias compras, según la regla autorizada.

En la compra aprobada, escribe la cantidad que llega en cada partida; deja vacías las que no recibiste. Confirma con motivo/comprobante. La recepción es atómica: si una línea excede lo pendiente, ninguna se ingresa. La compra queda PARCIAL hasta completar todas las partidas, luego RECIBIDA. Solo se cancelan compras sin recepción; su historial conserva autor y motivo. No se calculan impuestos, descuentos ni pagos.

Ante una respuesta de red incierta, reintenta el mismo formulario sin alterar los datos: conserva su clave para evitar duplicados. Antes de recargar o iniciar otro registro consulta el historial. Los errores de stock/estado o versión no registran movimientos parciales; vuelve a consultar los datos antes de corregirlos.

En el detalle de la orden, **Entregas y devoluciones de almacén** muestra los movimientos. Solo Logística ve el costo neto de piezas; compras y cierre no lo suman de nuevo. Mecánico documenta el uso real en el cierre, sin volver a descontar stock. Las piezas descriptivas de órdenes antiguas no adquieren costos automáticamente. El costo mostrado es de refacciones entregadas menos devueltas; no incluye tarifas de mano de obra todavía.
