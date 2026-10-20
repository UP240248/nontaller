# Matriz inicial de permisos

**Permisos base de Fase 1 aprobados por el usuario el 17 de octubre de 2026 e implementados. Los permisos de flota de Fase 2 fueron aprobados posteriormente por el usuario; Las decisiones de asignación, agrupación y finalización de Fase 3 fueron confirmadas por el usuario; Fase 4 tiene reglas confirmadas el 20 de octubre de 2026; Fases 5–7 siguen como propuesta.** C = crear, R = leer, U = editar. No se propone borrado físico. «Propio» requiere filtro en consultas y comprobación al acceder por ID. «Asignado» exige relación vigente en servidor. Toda acción no concedida se deniega. Las columnas incluyen acciones especiales por separado.

| Entidad / acción | Administración | Logística | Mecánico | Operador | Contabilidad |
|---|---|---|---|---|---|
| Usuarios / roles | C/R/U, activar/desactivar, asignar rol y revocar sesiones (aprobado) | Perfil propio | Perfil propio | Perfil propio | Perfil propio |
| Flota | C/R/U; activar/desactivar y estado operativo (aprobado) | C/R/U; activar/desactivar y estado operativo (aprobado) | R, historial y estado operativo (aprobado); sin C/U de datos ni activar | Sin acceso hasta definir unidades autorizadas | Sin acceso hasta aprobar consultas financieras |
| Reporte de falla | R general | R general | C/R; evaluación de prioridad | C/R propios; fotos propias | Sin acceso |
| Priorizar falla | R | R | Evaluar/actualizar antes de finalizar, con versión y motivo | No | No |
| Asignar/aceptar orden | Crear y asignar (aprobado) | Crear y asignar (aprobado) | Iniciar asignada; sin asignación | No | No |
| Trabajo y finalización | R, sin finalizar | R, sin finalizar | Iniciar/espera/finalizar solo asignado (aprobado) | R estado de sus fallas; sin órdenes internas | Sin acceso hasta aprobar costos |
| Inventario | R catálogo y disponibilidad, sin importes | C/R/U catálogos; entradas, entregas, devoluciones y ajustes; R costos | R catálogo y disponibilidad, sin importes | No | No |
| Proveedores/compras | R; C/U/aprobar pendientes | Solicitud pendiente | Solicitud pendiente | No | R; edición pendiente |
| Mantenimiento | R | R; configurar pendiente | R/ejecutar asignado propuesto | No | R costos autorizados |
| Costos/exportación financiera | Sin importes; R auditoría segura | R valuación, movimientos, compras y costo neto de refacciones por orden; sin exportación todavía | No importes | No | Sin acceso financiero aprobado todavía |
| Reportes operativos | R | R | Asignados | Propios | Solo agregados autorizados |
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
