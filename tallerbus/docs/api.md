# API REST — Fases 1–4

Base `/api/v1`. OpenAPI generado por Nest/DTOs, disponible en desarrollo en `/api/docs` y `/api/docs-json`; deshabilitado en producción. No hay JWT ni tokens en localStorage.

| Método / recurso | Acceso | Contrato |
|---|---|---|
| POST /auth/login | Público; Origin permitido obligatorio y límite por IP | email/password; cookie HttpOnly, SameSite Strict; devuelve usuario público y csrfToken |
| GET /auth/me | Sesión activa | Usuario propio y csrfToken recuperable tras recarga |
| POST /auth/logout | Sesión + CSRF + Origin | 204; revoca y borra cookie |
| GET /users | Administración | search, role, page (1), limit (20, máximo 100); data/total/page/limit |
| POST /users | Administración + CSRF | name, email, password (12–128), role; usuario público, 201 |
| PATCH /users/:id | Administración + CSRF | version obligatorio; name/email/role/active opcionales; 409 si obsoleto o último administrador |
| POST /users/:id/revoke-sessions | Administración + CSRF | Devuelve revoked; revoca todas las sesiones vigentes |
| GET /audit | Administración | page/limit; eventos, actor y cambios permitidos; nunca secretos |
| GET /health | Público | Consulta MySQL; status/database sin credenciales |

Las acciones autenticadas que modifican datos exigen `X-CSRF-Token` y Origin exacto de FRONTEND_ORIGIN. El token CSRF se devuelve por API y permanece solo en memoria del frontend; el token aleatorio de sesión solo en cookie, hash SHA-256 en BD. Contraseñas con Argon2id.

Fechas UTC ISO 8601. Usuarios públicos: id, name, email, role, active, version. Roles enum ADMINISTRACION, LOGISTICA, MECANICO, OPERADOR, CONTABILIDAD. No hay DELETE de usuarios ni actualización de contraseña por API todavía. Orden de usuarios y eventos estable, más recientes primero. Los listados no admiten campos de orden arbitrarios.

Errores: statusCode, message y requestId. 400 validación/campos desconocidos, 401 sesión inválida, 403 permiso/origen/CSRF, 404 recurso inexistente, 409 unicidad/versión/pérdida del último administrador, 429 intentos de acceso, 500 genérico sin detalles internos. Logs estructurados incluyen método, estado, duración y requestId; no cuerpos, cookies, URLs con consultas ni credenciales.

Inventario y compras se describen en Fase 4. Todos los importes/cantidades decimales son cadenas; no enviar números JSON. Los reportes/exportaciones generales quedan para fases futuras.

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
