# API REST — Fases 1–3

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

Inventario, compras y reportes financieros son contratos de fases futuras, sin endpoints implementados. Importes futuros se transportarán como cadenas decimales y usarán Decimal en MySQL/Prisma.

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

Estado enum: HABILITADO, EN_REPARACION, EN_ESPERA_REFACCIONES, FUERA_DE_SERVICIO. No representa el flujo de Falla, aún no implementado. Placas canónicas únicas (2–16 letras/dígitos, mayúsculas, sin espacios/guiones). Económico 1–30 caracteres alfanuméricos/espacios/guiones, uppercase/trim. Kilometraje entero no negativo hasta máximo Int MySQL. Motivo 3–500 caracteres tras trim. UUID inválido: 400; unidad inexistente: 404; duplicado/versión obsoleta: 409. No hay DELETE.

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

Todas las acciones mutantes exigen CSRF/Origin; versiones obsoletas o estado incompatible →409. Imágenes inválidas →400; exceso de tamaño →413; ID ajeno de operador →404; rol/asignación insuficiente →403. Finalizada no se edita/reabre/reasigna. No hay valoración económica, stock o costos ficticios ni bloqueo o habilitación automática de autobuses.
