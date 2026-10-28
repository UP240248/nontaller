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

## 2026-10-20 — Fase 5: preventivo por kilometraje

- Reglas confirmadas: solo kilometraje; Logística configura planes y asigna mecánicos; sin servicios/intervalos precargados.
- Plan por unidad con última lectura conocida, intervalo/checklist, versión, activación, filtros y vencimiento exacto en servidor.
- Programación atómica de orden/asignaciones/ejecución, una abierta por plan y snapshot histórico de tareas/intervalo.
- Checklist por mecánico asignado con avances/versiones; cierre exige tareas completas y lectura actual revisada de flota.
- Registro de servicio y siguiente objetivo sin doble consumo/costo ni cambio automático de estado de unidad.
- Lecturas de flota protegidas frente a retroceso anterior al servicio registrado; consultas operativas sin nuevos permisos financieros.
- Pruebas API/MySQL, carreras, recorridos E2E, móvil/accesibilidad y documentación. Sin nuevas dependencias.

## 2026-10-20 — Fase 6: vistas, reportes y CSV

- Usuario confirma lectura/exportación financiera exclusivamente para Logística/Contabilidad; Administración permanece sin importes.
- Siete reportes con filtros, paginación y resúmenes del conjunto completo; catálogo según rol y alcance propio/asignado.
- Costos por autobús desde entregas menos devoluciones, sin sumar compras como segundo consumo; valoración actual de inventario y totales de pedido/recepción separados.
- Cálculos exactos Decimal, redondeo de total por documento y snapshots consistentes de filas/conteo/agregados.
- CSV completo filtrado hasta 10000 filas, sin truncado; escape de comillas/saltos, protección de fórmulas, UTF-8 y descarga auditada sin importes en auditoría.
- Pantallas de consulta/exportación para los cinco roles, descargas reales y accesibilidad/móvil probadas. Sin nuevas dependencias o migraciones.
- Sin check-in/out, permisos de escritura para Contabilidad, tarifas laborales, pagos/fiscalidad o reportes históricos de saldos.

## 2026-10-20 — Fase 7: consolidación local

- Autenticación MySQL local tras reinicio con clave RSA pública fijada del contenedor conocido; sin recuperación automática de claves de red.
- Respuestas 413 para cuerpos excesivos y comparación segura de tokens Unicode.
- Actualización transitiva de Vite/SDK mediante overrides y lockfile; auditoría completa sin vulnerabilidades conocidas al validar. Limitación de diagnóstico npm ls documentada.
- Respaldo privado offline y restauración aislada con verificación de contenido, fotografías, relaciones, valoración y revocación de sesiones solo en copia.
- Pruebas de seguridad, recuperación, teclado y pantalla de 320 px: suite completa de 146 pruebas aprobada.
- Referencia local de carga acordada: 50 autobuses, 10 usuarios, 200 consultas sin errores; p95 65,05 ms.
- Manuales operativos actualizados; despliegue, respaldo externo y aceptación productiva/manual pendientes.

## 2026-10-20 — Cierre técnico para uso personal local

- Alcance confirmado: equipo personal, sin despliegue en la red de la empresa; infraestructura productiva queda fuera de la entrega actual.
- Guía de primera cuenta, roles, arranque, parada, respaldo y actualización sin pérdida de datos.
- `npm run status:local`: diagnóstico de API/MySQL, interfaz y proxy por HTTP de loopback, sin escrituras ni redirecciones.
- Lint y 13 unitarias aprobados, incluyendo cinco casos del diagnóstico local; la suite completa anterior de 146 pruebas conserva su evidencia histórica.

## 2026-10-27 — Datos ficticios para demostración

- Base/cuenta SQL demo independientes, sin limpiar o mezclar datos personales y sin cambiar permisos por rol.
- Preparación repetible sin duplicar: 12 unidades, 12 fallas, 9 órdenes, 6 piezas, 3 proveedores, 5 compras y 6 planes.
- Existencias y costos conciliados; cuentas aleatorias privadas de cinco roles; inicio local en 4202/3002 y guía de presentación.
- Comprobaciones específicas de integridad, aislamiento, reejecución y acceso real por rol.

## 2026-10-27 — Acceso por nombre de usuario

- Login, alta, edición, perfil y bootstrap sin correo; empleado y usuario separados en Usuarios.
- Mínimo de contraseña inicial reducido a 8, conservando hash Argon2id y privacidad de las claves.
- Migración de cuentas con normalización/colisiones, sin cambiar hashes, IDs, roles ni relaciones; cambio de usuario revoca sesiones.
- Cuentas privadas demo/desarrollo actualizadas sin regenerar claves; consulta local de identificadores y guía de actualización con respaldo.
- Pruebas de migración, API, frontend, mínimo exacto de ocho caracteres y rechazo de campos antiguos; manuales actualizados.

## 2026-10-27 — Dashboard operativo

- Inicio con tarjetas de indicadores, disponibilidad sobre activas, distribución por estado y puntos de atención.
- Actualización manual con hora, estados vacíos y fallos parciales sin confundir información ausente con cero.
- Diseño responsive y accesible, sin datos ficticios, dependencias nuevas, cambios financieros o ampliación de permisos.
- Recorridos de navegador para cálculos reales, errores/reintentos, roles y pantalla estrecha; guía de indicadores en docs/dashboard.md.

## 2026-10-28 — Arranque local verificado tras reinicio

- dev/demo preparan el contenedor y verifican SQL con sus cuentas antes de abrir API/interfaz; mensajes previos al arranque ante fallos.
- Prisma consulta SQL durante inicialización y el contenedor conocido usa unless-stopped, sin borrar datos ni regenerar claves.
- Modo/BD/puertos/origen validados; entorno privado del modo pasado explícitamente a procesos.
- Arranque real probado desde MySQL detenido en normal/demo, con datos/credenciales intactos y rechazo de clave errónea sin divulgación.
