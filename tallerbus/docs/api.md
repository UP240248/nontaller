# API REST — Fases 1 y 2

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

Fallas, órdenes, inventario y reportes son contratos de fases futuras, sin endpoints implementados. Importes futuros se transportarán como cadenas decimales y usarán Decimal en MySQL/Prisma.

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
