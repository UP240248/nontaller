# API REST — Fases 1–6

Base `/api/v1`. OpenAPI generado por Nest/DTOs, disponible en desarrollo en `/api/docs` y `/api/docs-json`; deshabilitado en producción. No hay JWT ni tokens en localStorage.

| Método / recurso | Acceso | Contrato |
|---|---|---|
| POST /auth/login | Público; Origin permitido obligatorio y límite por IP | username/password; cookie HttpOnly, SameSite Strict; devuelve usuario público y csrfToken |
| GET /auth/me | Sesión activa | Usuario propio y csrfToken recuperable tras recarga |
| POST /auth/logout | Sesión + CSRF + Origin | 204; revoca y borra cookie |
| GET /users | Administración | search, role, page (1), limit (20, máximo 100); data/total/page/limit |
| POST /users | Administración + CSRF | name, username, password (8–128), role; usuario público, 201 |
| PATCH /users/:id | Administración + CSRF | version obligatorio; name/username/role/active opcionales; 409 si obsoleto o último administrador |
| POST /users/:id/revoke-sessions | Administración + CSRF | Devuelve revoked; revoca todas las sesiones vigentes |
| GET /audit | Administración | page/limit; eventos, actor y cambios permitidos; nunca secretos |
| GET /health | Público | Consulta MySQL; status/database sin credenciales |

Las acciones autenticadas que modifican datos exigen `X-CSRF-Token` y Origin exacto de FRONTEND_ORIGIN. El token CSRF se devuelve por API y permanece solo en memoria del frontend; el token aleatorio de sesión solo en cookie, hash SHA-256 en BD. Contraseñas con Argon2id.

Fechas UTC ISO 8601. Usuarios públicos: id, name, username, role, active, version. Roles enum ADMINISTRACION, LOGISTICA, MECANICO, OPERADOR, CONTABILIDAD. No hay DELETE de usuarios ni actualización de contraseña por API todavía. Orden de usuarios y eventos estable, más recientes primero. Los listados no admiten campos de orden arbitrarios.

Errores: statusCode, message y requestId. 400 validación/campos desconocidos, 401 sesión inválida, 403 permiso/origen/CSRF, 404 recurso inexistente, 409 unicidad/versión/pérdida del último administrador, 429 intentos de acceso, 500 genérico sin detalles internos. Logs estructurados incluyen método, estado, duración y requestId; no cuerpos, cookies, URLs con consultas ni credenciales.

Inventario y compras se describen en Fase 4. Todos los importes/cantidades decimales son cadenas; no enviar números JSON. Los reportes y exportaciones de Fase 6 se describen al final.


Usuario: 3–40 caracteres, letras/números/punto/guion/guion bajo, inicio alfanumérico, normalización trim + minúsculas. No se devuelve contraseña/hash. Edición de username revoca sesiones.

## Autobuses (Fase 2)

Base `/api/v1/autobuses`. Lectura: Administración, Logística y Mecánico; los demás roles reciben 403. Mutaciones autenticadas exigen Origin, CSRF y políticas del servidor.

| Método / recurso | Acceso y contrato |
|---|---|
| GET /autobuses | search (económico/placas/marca/modelo), activo=true/false, estadoOperativo, page/limit; sort=numeroEconomico/placas/kilometraje/createdAt, direction=asc/desc; orden secundario ID |
| GET /autobuses/metricas | total/activos/inactivos/disponibles/enTaller/porEstado; lectura de los tres roles |
| GET /autobuses/:id | Detalle con ID, datos, activo, estado, versión y timestamps |
| GET /autobuses/:id/historial | Eventos paginados, actor, fecha y antes/después/motivo; más recientes primero |
| POST /autobuses | Administración/Logística; numeroEconomico, placas, marca, modelo, kilometraje, estadoOperativo; alta activa, 201 |
| PATCH /autobuses/:id | Administración/Logística; campos descriptivos opcionales + version y motivo obligatorios; no admite activo/estado |
| PATCH /autobuses/:id/estado | Los tres roles; estadoOperativo, version, motivo |
| PATCH /autobuses/:id/activacion | Administración/Logística; activo boolean, version, motivo |

Estado enum: HABILITADO, EN_REPARACION, EN_ESPERA_REFACCIONES, FUERA_DE_SERVICIO. Es independiente del flujo de Falla. Placas canónicas únicas (2–16 letras/dígitos, mayúsculas, sin espacios/guiones). Económico 1–30 caracteres alfanuméricos/espacios/guiones, uppercase/trim. Kilometraje entero no negativo hasta máximo Int MySQL. Motivo 3–500 caracteres tras trim. UUID inválido: 400; unidad inexistente: 404; duplicado/versión obsoleta: 409. No hay DELETE.

## Fallas — Fase 3

| Método / recurso bajo /api/v1 | Contrato / autorización |
|---|---|
| POST /fallas | Mecánico/Operador; numeroEconomico conocido, tipo 2–60, descripcion 10–2000; server fija reportante, UTC, Pendiente y prioridad null |
| GET /fallas | Administración/Logística/Mecánico ven general; Operador solo propios. search, autobusId, numeroEconomico exacto, estado, prioridad, tipo exacto, mecanicoId asignado vigente, desde/hasta ISO UTC inclusivos, sinOrden=true/false, page/limit |
| GET /fallas/metricas | abiertas = Pendiente + En proceso, respetando alcance del usuario |
| GET /fallas/:id | Detalle y metadatos de evidencia autorizados; no storageKey/checksum privado |
| PATCH /fallas/:id/evaluacion | Solo Mecánico; version, prioridad BAJA/MEDIA/ALTA/CRITICA, evaluacion 10–2000 y motivo; no finalizadas |
| POST /fallas/:id/evidencias | Mecánico o Operador propietario; multipart file único PNG/JPEG ≤5 MB, sin campos extra; 201 |
| GET /fallas/:id/evidencias/:evidenceId | Descarga autenticada, bytes/hash verificados; operador solo propio; attachment y no-sniff |
| GET /fallas/:id/historial | Paginación y alcance como detalle; actor, acción, UTC y cambios seguros |

No se admite manipular reportante/estado/prioridad en el alta. El reporte original no tiene edición ni DELETE. Su evaluación sí se actualiza con versión hasta cierre. Fechas de reporte son del servidor; no se inventa fecha de ocurrencia pasada. Imágenes duplicadas por checksum en una falla devuelven 409 sin duplicar auditoría ni archivo. No hay PATCH /fallas/:id/finalizar: la finalización debe pasar por la orden.

## Órdenes — Fase 3

Lectura: Administración/Logística/Mecánico; Operador/Contabilidad no acceden.

| Método / recurso bajo /api/v1 | Contrato / autorización |
|---|---|
| GET /ordenes | search título/unidad, estado, autobusId, mecanicoId asignado vigente, desde/hasta UTC, page/limit, orden descendente estable |
| GET /ordenes/mecanicos | Solo Administración/Logística; ID/nombre de mecánicos activos |
| POST /ordenes | Administración/Logística; titulo y fallaIds únicos (1–100 por lote), evaluadas, pendientes, sin orden y de una misma unidad |
| GET /ordenes/:id | Fallas, asignaciones vigentes e históricas, diagnóstico y finalización si existe |
| PATCH /ordenes/:id/asignaciones | Administración/Logística; version, motivo y mecanicoIds activos; reemplaza conjunto vigente preservando historia |
| POST /ordenes/:id/iniciar | Mecánico asignado; version, motivo, diagnostico 10–2000; orden Abierta → En proceso y fallas Pendiente → En proceso; 200 |
| PATCH /ordenes/:id/espera | Mecánico asignado; version, motivo, esperaRefacciones boolean; solo En proceso, sin alterar estados ni autobús |
| POST /ordenes/:id/finalizar | Mecánico asignado; version, motivo, trabajoRealizado, observaciones, aplicoManoObra, manoObraMinutos, aplicaronRefacciones, refacciones; 200 |
| GET /ordenes/:id/historial | Eventos propios de orden paginados; las transiciones de fallas figuran también en su historial |

Cada refacción descriptiva requiere descripcion, cantidad decimal positiva como cadena (hasta 9 enteros/3 decimales) y unidad. Si labor aplica, minutos enteros positivos; si no, cero. Si piezas aplican, lista no vacía; si no, lista vacía. La fecha final y responsable los fija el servidor. Fallas agrupadas se finalizan atómicamente, una sola finalización por orden. El máximo de lote es técnico por petición, no un límite de usuarios o mecánicos de la empresa.

Todas las acciones mutantes exigen CSRF/Origin; versiones obsoletas o estado incompatible →409. Imágenes inválidas →400; exceso de tamaño →413; ID ajeno de operador →404; rol/asignación insuficiente →403. Finalizada no se edita/reabre/reasigna. El cierre no crea costos ni movimientos de stock. La Fase 4 toma el costo de refacciones exclusivamente del ledger de entregas/devoluciones. No hay bloqueo o habilitación automática de autobuses.

## Inventario y compras — Fase 4

Catálogos: `/refacciones` y `/proveedores`, con GET lista/detalle/`:id/historial`, POST alta, PATCH `:id` edición y PATCH `:id/activacion`. Listas aceptan `page/limit`, `search`, `activo=true/false`. Edición/activación exige versión y motivo. Solo Logística escribe; proveedores solo Logística, refacciones también Administración/Mecánico. Campos de pieza: sku, descripcion, unidad, categoria opcional y minimo decimal no negativo. Proveedor: codigo, nombre y contacto/email/telefono opcionales. Los códigos son canónicos únicos. No se cambia unidad después de registrar movimientos o líneas de compra.

Todas las mutaciones siguientes son exclusivamente de Logística y requieren `operacionId` UUIDv4 y `motivo` (3–500). La misma clave y contenido/actor devuelve la respuesta original; reutilizarla en otra ruta o con datos distintos devuelve 409. Las mutaciones completadas devuelven 201, incluidos reintentos. No hay PATCH/DELETE del ledger. Cantidad positiva hasta 9 enteros/3 decimales; costo unitario no negativo hasta 9 enteros/6 decimales. El ajuste admite signo y excluye cero.

| Método / recurso bajo /api/v1 | Contrato |
|---|---|
| GET /inventario/existencias | Administración/Logística/Mecánico; page/limit, search SKU/descripción, refaccionId opcional; incluye cero stock, mínimo y alerta. Solo Logística recibe valor/costoPromedio/moneda |
| GET /inventario/movimientos | Logística; page/limit, refaccionId/ordenId; movimientos con cantidades/valor firmados, costo histórico, saldo posterior, actor y motivo privado |
| POST /inventario/entradas | refaccionId, cantidad, costoUnitario; ingreso directo sin compra, p.ej. inventario inicial con comprobante |
| POST /inventario/entregas | refaccionId, ordenId, cantidad; descuenta al entregar a orden no finalizada, a promedio vigente |
| POST /inventario/devoluciones | origenId de entrega, cantidad; no puede exceder lo entregado sin devolver, incluso en concurrencia; costo original; admite orden cerrada o pieza inactiva |
| POST /inventario/ajustes | refaccionId, cantidad firmada; promedio vigente. Ajuste positivo sin saldo previo:409, usar entrada con costo |
| GET /inventario/ordenes/:id/materiales | Administración/Logística/Mecánico; cantidades y descripciones históricas, sin importes ni comprobantes privados |
| GET /inventario/ordenes/:id/costo | Solo Logística; costoRefacciones neto de entregas menos devoluciones, MXN; no incluye compras ni piezas descriptivas del cierre |
| GET /compras | Logística; page/limit, estado opcional; proveedor y líneas, orden fecha/ID descendente |
| GET /compras/:id | Logística; líneas, cantidades pedidas/recibidas, costo unitario histórico, totalMXN, historial privado con actor/motivo |
| POST /compras | proveedorId activo, referencia, lineas de refaccionId/cantidad/costoUnitario; 1–50 líneas de piezas distintas; crea BORRADOR sin movimientos |
| POST /compras/:id/aprobar | version; solo BORRADOR, aprobador fijado por sesión, admite creador; no genera entradas |
| POST /compras/:id/cancelar | version; solo BORRADOR/APROBADA sin recepción; conserva historia |
| POST /compras/:id/recepciones | version, lineas de lineaId/cantidad (1–50 únicas); solo APROBADA/PARCIAL; límite por pendiente; atomicidad de todo el lote y stock; estado PARCIAL/RECIBIDA |

Las recepciones conservan el costo aprobado de cada línea; no aceptan sobrescribir precios ni moneda. Falta de stock, versión obsoleta, inactividad, recepción excesiva o estado incompatible:409. Cero cantidad:400. Claves idempotentes y saldos se protegen bajo un bloqueo transaccional del almacén único, aislamiento READ COMMITTED. El diseño serial inicial prioriza consistencia; no afirma capacidad de múltiples almacenes o alto volumen.

## Mantenimiento preventivo — Fase 5

Lectura para Administración/Logística/Mecánico. Mutaciones de planes y programación solo Logística; todos los cambios requieren sesión/Origin/CSRF. Sin DELETE ni intervalos precargados. `intervaloKm` entero 1–10,000,000; kilometrajes enteros 0–2,147,483,647. Los límites son técnicos. Nombre de servicio 3–100, único por unidad; checklist de 1–50 textos distintos de 3–200 caracteres, recortados. `ultimoServicioKm` inicial debe ser menor o igual al kilometraje actual de un autobús activo y no puede modificarse por PATCH.

| Método / recurso bajo /api/v1 | Contrato |
|---|---|
| GET /mantenimiento/planes | page/limit, autobusId, search nombre/unidad, activo=true/false, vencido=true/false; cálculo y filtro de vencimiento en servidor antes de paginar |
| POST /mantenimiento/planes | autobusId, nombre, intervaloKm, ultimoServicioKm, checklist; alta activa y auditoría |
| GET /mantenimiento/planes/:id | Plan, flota actual, proximoKm, restanKm, vencido y ejecucionActiva si existe |
| PATCH /mantenimiento/planes/:id | nombre, intervaloKm, checklist completos + version/motivo; preserva snapshots de ejecuciones |
| PATCH /mantenimiento/planes/:id/activacion | activo boolean + version/motivo; no elimina ni cancela ejecuciones abiertas |
| POST /mantenimiento/planes/:id/programar | version/motivo y mecanicoIds activos únicos, 1–100; plan/unidad activos; crea orden ABIERTA y ejecución snapshot con asignación, sin fallas ficticias; 201 |
| GET /mantenimiento/planes/:id/ejecuciones | page/limit; ejecuciones con checklist histórico y orden; fecha/ID descendente |
| GET /mantenimiento/planes/:id/historial | page/limit; eventos, actor, fecha y motivo; orden descendente estable |
| GET /mantenimiento/ejecuciones/:id | Snapshot, pasos, orden/version/estado/asignaciones y lectura actual de flota |
| PATCH /mantenimiento/ejecuciones/:id/checklist | Solo Mecánico asignado, orden EN_PROCESO; version de orden, motivo, pasos completos (id/completado/observaciones); observaciones hasta 500, puede ser vacío. Guarda avance e incrementa versión de orden |

Plan vencido = plan activo + unidad activa + kilometraje actual >= ultimoServicioKm + intervaloKm. No se utilizan fechas para vencimiento. Programar antes del objetivo es posible con motivo; no cambia la base hasta terminar. Una ejecución abierta por plan mediante clave única nullable. Reintento de programación con versión anterior produce 409 y no crea otra orden; consultar ejecucionActiva para recuperar la orden ya creada.

`GET /ordenes/:id` añade `preventivo: {id,planId}|null` y kilometraje actual en su proyección de autobús. Inicio, espera, asignación logística, piezas y cierre usan el flujo existente. Para una orden preventiva, `/ordenes/:id/finalizar` exige además `kilometrajePreventivo` entero igual al kilometraje actual revisado de flota y todos los pasos completos. La transacción cierra ejecución/orden, conserva lectura/UTC/responsable, libera la clave activa y actualiza ultimoServicioKm/version del plan. Si la lectura cambió o falta checklist:409 sin cierre parcial. No modifica odómetro ni estado de autobús y no registra otro consumo/costo.

La edición de kilometraje en flota se serializa con programación/cierre y no puede retroceder por debajo de la mayor lectura de último servicio registrada en planes de esa unidad. No se permite corregir un cierre o reemplazar odómetro por este mecanismo. La reasignación de órdenes preventivas es solo de Logística; la política previa de órdenes correctivas se conserva.

## Reportes y exportación — Fase 6

| Método / recurso bajo /api/v1 | Contrato |
|---|---|
| GET /reportes/catalogo | Sesión activa; tipos/títulos/descripciones y flag financiero de los reportes permitidos al rol |
| GET /reportes/:tipo | Columnas tipadas, data paginada, total, resumen de todo el conjunto filtrado, alcance, descripcion, generadoAt UTC, page/limit |
| GET /reportes/:tipo/csv | Mismos permisos/filtros; exporta todas las filas filtradas, ignora paginación para filas. UTF-8 con BOM, comas, CRLF, comillas RFC 4180, attachment y no-store; X-Total-Count indica filas de datos |

Tipos: flota, fallas, ordenes, preventivos, compras, inventario, costos. Desconocido:404. Compras/inventario/costos solo Logística/Contabilidad. Administración/Logística acceden a todos los operativos; Mecánico ve flota/preventivos, órdenes asignadas vigentes y fallas propias/asignadas; Operador solo fallas propias; Contabilidad solo los tres financieros. Rol insuficiente:403; sesión inválida:401.

Todos aceptan search/page/limit (máximo 100 en JSON). Filtros específicos se combinan por intersección y se aplican antes de contar/paginar:

| Tipo | Filtros adicionales | Totales / semántica |
|---|---|---|
| flota | autobusId, estado operativo, activo=true/false | unidades/activas/disponibles, situación actual |
| fallas | autobusId, estado de falla, prioridad, mecanicoId vigente, desde/hasta | fallas/abiertas/finalizadas, fecha de registro |
| ordenes | autobusId, estado de orden, mecanicoId vigente, desde/hasta | órdenes/finalizadas/minutos registrados, fecha de registro; sin tarifas |
| preventivos | autobusId, activo, vencido=true/false | planes/vencidos, calculados con lectura actual y unidad/plan activos |
| compras | proveedorId, estado de compra, desde/hasta | total pedido, pedido sin canceladas y valor recibido; fechas filtran creación de compra y recepción acumulada de esas compras |
| inventario | refaccionId, activo | valor de existencias actual; incluye piezas sin saldo como cero, no suma cantidades de unidades de medida distintas |
| costos | autobusId, estado de orden, refaccionId, desde/hasta | por autobús: entregado/devuelto/neto MXN; fecha del movimiento; solo ENTREGAS/DEVOLUCIONES de órdenes |

Estados/rangos/filtros incompatibles o desconocidos:400. desde/hasta ISO 8601 inclusivos; frontend pide UTC explícito. Los importes/cantidades son cadenas decimales; valor a seis decimales HALF_UP. El total pedido se calcula por documento y después se suma, reconciliando el redondeo de cada fila; recepciones/consumos se reconcilian con el ledger, no con importes estimados. Puede haber costo neto negativo por devoluciones del período de entregas anteriores.

Cada consulta usa una transacción REPEATABLE READ para que filas/conteo/totales correspondan al mismo snapshot. Una descarga es una nueva consulta y puede incluir cambios posteriores a lo mostrado. JSON sigue paginado; exportación de más de 10000 filas:400 con petición de reducir filtros, sin archivo parcial ni evento de éxito. No hay endpoints de exportación de escritura, xlsx/PDF, costos laborales estimados o reconstrucción de inventario histórico.

CSV protege texto que empieza con =, +, -, @ tras blancos/controles mediante prefijo apóstrofo; escapa comillas, comas y saltos. Las columnas numéricas solo aceptan formato decimal/entero canónico, preservando negativos reales sin conversión a Number. Evento REPORT_EXPORT en AuditEvent incluye tipo/filas/alcance/actor, sin importes ni términos de búsqueda; consultas no modifican datos de negocio.
