# Matriz inicial de permisos

**Permisos base de Fase 1 aprobados por el usuario el 17 de octubre de 2026 e implementados. Los permisos de flota de Fase 2 fueron aprobados posteriormente por el usuario; Las decisiones de asignación, agrupación y finalización de Fase 3 fueron confirmadas por el usuario; Fase 4 tiene reglas confirmadas el 20 de octubre de 2026; Fase 5 tiene aprobación de kilometraje y gestión por Logística; Fase 6 confirma lectura/exportación financiera de Logística/Contabilidad; Fase 7 sigue pendiente.** C = crear, R = leer, U = editar. No se propone borrado físico. «Propio» requiere filtro en consultas y comprobación al acceder por ID. «Asignado» exige relación vigente en servidor. Toda acción no concedida se deniega. Las columnas incluyen acciones especiales por separado.

| Entidad / acción | Administración | Logística | Mecánico | Operador | Contabilidad |
|---|---|---|---|---|---|
| Usuarios / roles | C/R/U, activar/desactivar, asignar rol y revocar sesiones (aprobado) | Perfil propio | Perfil propio | Perfil propio | Perfil propio |
| Flota | C/R/U; activar/desactivar y estado operativo (aprobado) | C/R/U; activar/desactivar y estado operativo (aprobado) | R, historial y estado operativo (aprobado); sin C/U de datos ni activar | Sin acceso hasta definir unidades autorizadas | Sin acceso hasta aprobar consultas financieras |
| Reporte de falla | R general | R general | C/R; evaluación de prioridad | C/R propios; fotos propias | Sin acceso |
| Priorizar falla | R | R | Evaluar/actualizar antes de finalizar, con versión y motivo | No | No |
| Asignar/aceptar orden | Crear y asignar (aprobado) | Crear y asignar (aprobado) | Iniciar asignada; sin asignación | No | No |
| Trabajo y finalización | R, sin finalizar | R, sin finalizar | Iniciar/espera/finalizar solo asignado (aprobado) | R estado de sus fallas; sin órdenes internas | Sin acceso hasta aprobar costos |
| Inventario | R catálogo y disponibilidad, sin importes | C/R/U catálogos; entradas, entregas, devoluciones y ajustes; R costos | R catálogo y disponibilidad, sin importes | No | R/exportar valoración solo en Reportes |
| Proveedores/compras | No | C/R/U proveedores; crear/aprobar incluso propias, cancelar sin recepción y recibir compras | No | No | R/exportar resumen de compras en Reportes; sin contactos ni escritura |
| Mantenimiento | R, sin configurar/asignar preventivos | C/R/U planes, activar/desactivar y crear/asignar órdenes preventivas | R; iniciar, checklist y finalizar solo asignado | No | No |
| Costos/exportación financiera | Sin importes; R auditoría segura | R/exportar compras, valoración y costos netos por autobús; conserva operaciones previas | No importes | No | R/exportar compras, valoración y costos netos por autobús |
| Reportes operativos | R/exportar flota, fallas, órdenes y preventivos | R/exportar general | Flota/preventivos; órdenes asignadas; fallas propias/asignadas | R/exportar solo fallas propias | Solo reportes financieros aprobados |
| Auditoría | R explícito | No por defecto | No | No | No por defecto |

## Acceso base de Fase 1 aprobado e implementado

El usuario aprobó expresamente que Administración cree/desactive usuarios, asigne roles y revoque sesiones; los demás roles acceden únicamente a su propio perfil. Administración también consulta la auditoría de estas acciones y gestiona nombre/correo. No existe borrado físico ni edición financiera. Solo se permiten los cinco roles enumerados. No se implementó un editor de permisos granulares: el servidor usa guard de sesión y guard de Administración, además de revalidar el actor dentro de las transacciones de usuarios.

Bootstrap requiere terminal y contraseña oculta sin valores predefinidos; se rechaza si ya existe administrador activo. El mutex AdminLock serializa bootstrap, cambios de rol/activación y revocación con creación de sesiones. Se bloquea la pérdida del último administrador; cambios de rol y desactivación revocan sesiones. Usuarios usa versión para rechazar ediciones concurrentes. Pruebas de integración cubren el ciclo y una carrera entre desactivaciones.

Ocultar módulos en UI solo facilita navegación. Backend aplica políticas, alcance y proyección de campos; los listados, detalles, exportaciones y archivos comparten control de acceso. Pruebas por rol incluyen 401, 403, acceso a ID ajeno, campos financieros y revocación. Registro de cambios de permisos sin secretos. La matriz de módulos posteriores requiere validación de Terrabus; la aprobación registrada cubre únicamente los fundamentos descritos.

## Fase 2: flota aprobada

El usuario confirmó que Administración y Logística crean/editan y activan/desactivan autobuses, las placas son únicas y los tres roles (incluido Mecánico) cambian estado operativo. La lectura de flota, indicadores e historial está habilitada para esos tres roles; Operador y Contabilidad siguen sin acceso.

Cambios generales: PATCH /autobuses/:id solo campos de identificación, marca/modelo y kilometraje. Estado y activación tienen endpoints separados; no pueden cambiarse mediante ese PATCH. Mecánico recibe 403 al intentar alta, edición de datos o activación, aunque construya la petición fuera de la UI. Cada mutación revalida al actor activo en la transacción. Se aplica CSRF/origen, versión y auditoría atómica. No existe endpoint de borrado.

## Fase 3: permisos implementados

- Administración/Logística: consulta general de fallas, evidencias e historial; creación de órdenes con fallas evaluadas de una unidad; asignación de mecánicos activos y cambios de asignación trazables. No evalúan prioridad ni finalizan órdenes.
- Mecánico: reporta fallas, consulta fallas/órdenes, confirma prioridad y evaluación, adjunta evidencia. Solo siendo mecánico activo y asignado inicia, registra espera o finaliza la orden. No puede asignarse ni asignar a otros.
- Operador: crea reporte de unidad activa por económico conocido; lista, detalle, métricas, fotos e historial exclusivamente propios. No puede cambiar prioridad, reportante, unidad, estado ni acceder a órdenes. Adivinar un ID ajeno devuelve 404 y no permite descargar su evidencia.
- Contabilidad: sin acceso nuevo; mantiene solo su perfil.

Directorio `/ordenes/mecanicos` solo para coordinadores; expone ID y nombre de mecánicos activos, nunca correos, hashes o acceso a gestión de usuarios. El reporte inicial permanece inmutable; la evaluación se puede actualizar por Mecánico antes de finalizar. Cierres finalizados no se reabren ni reasignan sin una futura política explícita.

La finalización exige trabajo, observaciones, responsable asignado, fecha UTC y declaración expresa de labor/piezas aplicables. Minutos y cantidades deben ser coherentes con esas declaraciones. No habilita automáticamente el autobús y, por decisión expresa del usuario, una falla abierta no impide su habilitación manual.

## Fase 4: inventario y compras confirmados

Solo Logística modifica catálogos, opera el almacén, consulta movimientos con costos y administra compras. La aprobación de compras propias está expresamente autorizada. Administración y Mecánico consultan catálogo de piezas, existencias y entregas/devoluciones de órdenes sin campos monetarios. Los contactos de proveedores, comprobantes privados, compras y costos no se conceden a esos roles. Operador y Contabilidad no reciben nuevos permisos.

El servidor verifica sesión/Origin/CSRF y revalida el actor activo de Logística dentro de las transacciones. La auditoría administrativa contiene IDs, acciones y cantidades; omite importes, contactos y comprobantes privados. Las operaciones financieras no tienen edición ni borrado; las correcciones se registran mediante movimientos nuevos con motivo. Los precios no pueden introducirse mediante campos ajenos en el catálogo.

## Fase 5: preventivo por kilometraje

El usuario confirmó programación por kilometraje y que Logística cree planes y asigne mecánicos. No definió servicios ni intervalos, por lo que se capturan sin valores predeterminados. Administración y Mecánico consultan planes, ejecuciones e historial; solo Logística crea/edita/activa planes y programa/asigna preventivos. La autorización general de Administración para órdenes correctivas no permite reasignar órdenes preventivas.

Solo el mecánico activo asignado registra el checklist de una orden en proceso y finaliza mediante el cierre existente. El servidor exige todas sus tareas completas y lectura de kilometraje de flota revisada. Mecánico no recibe permiso nuevo para editar el odómetro: Administración/Logística conservan la gestión de flota. Operador/Contabilidad no reciben acceso a mantenimiento. No hay permisos financieros nuevos.

## Fase 6: reportes y exportación

El usuario eligió expresamente «Logística y Contabilidad» para consultar/exportar compras, valoración de inventario y costos de refacciones por autobús. Administración no recibe importes. Contabilidad obtiene únicamente los tres reportes financieros: no accede a contactos de proveedores, ledger detallado, gestión de flota, órdenes completas ni escritura de inventario/compras.

Todos los roles acceden al catálogo servidor de reportes permitidos. Administración/Logística consultan y exportan los cuatro operativos. Mecánico conserva flota/preventivos de consulta y obtiene órdenes con asignación vigente propia y fallas propias o de esas órdenes. Operador consulta/exporta exclusivamente fallas propias. IDs/filtros adicionales se intersectan con ese alcance; no permiten ampliarlo. JSON y CSV utilizan las mismas reglas, filtros y proyección.

La exportación registra evento con actor/tipo/filas/alcance, sin importes, textos de búsqueda o contenido exportado en la auditoría administrativa. CSV y reportes usan no-store; sesión revocada invalida nuevas consultas/exportaciones. No se habilita check-in/out, asignación operador-unidad ni notificaciones externas.

## Identificador de cuenta — 27 de octubre de 2026

La gestión vigente usa nombre del empleado y username, no correo. Administración consulta y edita esos datos, rol y estado, sin lectura de contraseñas. El hash no se proyecta. Las menciones de correo en notas por fase son históricas. Contraseña inicial de mínimo 8; cambios de username revocan sesiones. Permisos de negocio conservados.
