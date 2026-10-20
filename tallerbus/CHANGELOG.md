# Registro de cambios

## 2026-10-17 — Fase 0 documental

- Inspección de checkout y remoto sin código ni referencias; anterior y bocetos no disponibles.
- Propuestas de arquitectura, módulos, ER, permisos, reutilización y fases con aceptación.
- Riesgos, preguntas de negocio y requisitos para Fase 1 documentados.
- Sin código de aplicación, dependencias, migraciones o cambios destructivos; sin pruebas funcionales ejecutables.

- Repositorio anterior identificado por el usuario: `UP240248/taller-autobuses`; lectura bloqueada con HTTP 403 en clonación y consulta de referencias.
- Verificados enlaces relativos de los 14 documentos; no se ejecutaron pruebas de aplicación.

- Usuario autoriza continuar desde cero. ZIP anterior no inspeccionado: excede límite de transferencia de 32 MiB. Su revisión ya no bloquea el proyecto nuevo.

## 2026-10-17 — Fase 1: fundamentos

- Continuación desde cero y permisos base aprobados por el usuario.
- Workspace Angular/NestJS/Prisma/MySQL con versiones fijadas, migración inicial y scripts repetibles.
- Sesiones opacas, Argon2id, CSRF/origen, límites de acceso, revocación y validación estricta.
- Administración de usuarios, protección del último administrador con control transaccional y auditoría.
- Layout responsive, navegación por rol, perfil, formularios, confirmaciones y tablas paginadas.
- Unitarias, integración MySQL y E2E reales con fixtures aislados; documentación actualizada.
- Prisma actualizado a 7.10.1 tras detectar advisory transitivo en la versión inicialmente evaluada.

## 2026-10-17 — Fase 2: flota

- Permisos de Administración/Logística y estado operativo de Mecánico aprobados; placas únicas.
- Modelo Autobus, migraciones aditivas, restricciones de BD e historial con FK restrictiva.
- API con búsqueda/filtros/paginación/orden servidor, activación y estado separados, auditoría transaccional y conflictos de versión.
- Angular: listado, registro, edición, detalle, historial y dashboard con datos reales.
- Pruebas de flota API/E2E, roles, concurrencia, métricas, móvil y accesibilidad automatizada.
- Sin módulos de Fases 3–7 ni migración de datos anteriores.

## 2026-10-17 — Guardado Fases 1/2 e implementación de Fase 3

- Commit local `da104eb` de fundamentos y flota, solicitado por el usuario; sin push ni credenciales/artefactos.
- Reglas recibidas: Administración/Logística asignan; varias fallas de una unidad por orden; Mecánico finaliza; sin bloqueo de habilitación por fallas.
- Reporte y evaluación de fallas con alcance propio de Operador, fotos privadas y auditoría.
- Órdenes agrupadas, asignaciones históricas, diagnóstico/inicio, condición de espera y finalización transaccional por mecánico asignado.
- Cierre con trabajo, observaciones, tiempo y piezas descriptivas exactas, sin inventario ni importes no aprobados.
- Integración con dashboard/unidad y mejora de acceso por teclado a tablas desplazables.
- Pruebas de API, archivos, roles, concurrencia y recorrido real de navegador; resultados finales en validacion-fase-3.

- Validación final conjunta: 63 pruebas pasadas, lint/typecheck/build correctos; start_skill actualizado en borrador cloud, sin publicación.

## 2026-10-20 — Fase 4: inventario y compras

- Reglas confirmadas: almacén único, descuento al entregar sin negativos, Logística opera y aprueba incluso compras propias, MXN y promedio ponderado.
- Catálogos de refacciones/proveedores con validación, control de versión, activación e historia; unidad fija después del uso.
- Entradas, entregas a órdenes, devoluciones con costo original y ajustes; ledger/saldo transaccionales y claves idempotentes.
- Compras multipieza, aprobación explícita, recepción parcial/completa atómica y cancelación antes de recibir; historia privada.
- Costos exactos con Decimal; cantidades/costos transportados como cadenas. Cierre de reparación sin doble descuento ni doble costo por compra.
- Pantallas Angular, disponibilidad sin costos para Administración/Mecánico y operaciones/costos solo para Logística.
- Pruebas API/MySQL, concurrencia, reintentos, devoluciones/redondeo y recorridos E2E con accesibilidad automatizada y móvil. Sin nuevas dependencias.
- Sin fiscalidad, pagos, reservas, tarifas laborales, devolución a proveedor ni permisos financieros de Contabilidad.
