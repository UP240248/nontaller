# Matriz inicial de permisos

**Permisos base de Fase 1 aprobados por el usuario el 17 de octubre de 2026 e implementados. Los permisos de flota de Fase 2 fueron aprobados posteriormente por el usuario; Fases 3–7 siguen como propuesta.** C = crear, R = leer, U = editar. No se propone borrado físico. «Propio» requiere filtro en consultas y comprobación al acceder por ID. «Asignado» exige relación vigente en servidor. Toda acción no concedida se deniega. Las columnas incluyen acciones especiales por separado.

| Entidad / acción | Administración | Logística | Mecánico | Operador | Contabilidad |
|---|---|---|---|---|---|
| Usuarios / roles | C/R/U, activar/desactivar, asignar rol y revocar sesiones (aprobado) | Perfil propio | Perfil propio | Perfil propio | Perfil propio |
| Flota | C/R/U; activar/desactivar y estado operativo (aprobado) | C/R/U; activar/desactivar y estado operativo (aprobado) | R, historial y estado operativo (aprobado); sin C/U de datos ni activar | Sin acceso hasta definir unidades autorizadas | Sin acceso hasta aprobar consultas financieras |
| Reporte de falla | R | R/U operativo propuesto | C/R/U autorizado | C/R propio | Sin acceso salvo reporte agregado autorizado |
| Priorizar falla | R | R | Acción propuesta | No | No |
| Asignar/aceptar orden | R | Coordinación; asignar pendiente | Aceptar propia; asignar pendiente | No | No |
| Trabajo y finalización | R | R operativo | C/U/finalizar asignado, pendiente de política | R estado propio sin datos internos | R costos autorizados |
| Inventario | R; ajustes pendientes | R disponibilidad | R disponibilidad; consumo asignado pendiente | No | R costos |
| Proveedores/compras | R; C/U/aprobar pendientes | Solicitud pendiente | Solicitud pendiente | No | R; edición pendiente |
| Mantenimiento | R | R; configurar pendiente | R/ejecutar asignado propuesto | No | R costos autorizados |
| Costos/exportación financiera | R financiero explícito por validar | No por defecto | No importes por defecto | No | R/exportar propuestos |
| Reportes operativos | R | R | Asignados | Propios | Solo agregados autorizados |
| Auditoría | R explícito | No por defecto | No | No | No por defecto |

## Acceso base de Fase 1 aprobado e implementado

El usuario aprobó expresamente que Administración cree/desactive usuarios, asigne roles y revoque sesiones; los demás roles acceden únicamente a su propio perfil. Administración también consulta la auditoría de estas acciones y gestiona nombre/correo. No existe borrado físico ni edición financiera. Solo se permiten los cinco roles enumerados. No se implementó un editor de permisos granulares: el servidor usa guard de sesión y guard de Administración, además de revalidar el actor dentro de las transacciones de usuarios.

Bootstrap requiere terminal y contraseña oculta sin valores predefinidos; se rechaza si ya existe administrador activo. El mutex AdminLock serializa bootstrap, cambios de rol/activación y revocación con creación de sesiones. Se bloquea la pérdida del último administrador; cambios de rol y desactivación revocan sesiones. Usuarios usa versión para rechazar ediciones concurrentes. Pruebas de integración cubren el ciclo y una carrera entre desactivaciones.

Ocultar módulos en UI solo facilita navegación. Backend aplica políticas, alcance y proyección de campos; los listados, detalles, exportaciones y archivos comparten control de acceso. Pruebas por rol incluyen 401, 403, acceso a ID ajeno, campos financieros y revocación. Registro de cambios de permisos sin secretos. La matriz de módulos posteriores requiere validación de Terrabus; la aprobación registrada cubre únicamente los fundamentos descritos.

## Fase 2: flota aprobada

El usuario confirmó que Administración y Logística crean/editan y activan/desactivan autobuses, las placas son únicas y los tres roles (incluido Mecánico) cambian estado operativo. La lectura de flota, indicadores e historial está habilitada para esos tres roles; Operador y Contabilidad siguen sin acceso.

Cambios generales: PATCH /autobuses/:id solo campos de identificación, marca/modelo y kilometraje. Estado y activación tienen endpoints separados; no pueden cambiarse mediante ese PATCH. Mecánico recibe 403 al intentar alta, edición de datos o activación, aunque construya la petición fuera de la UI. Cada mutación revalida al actor activo en la transacción. Se aplica CSRF/origen, versión y auditoría atómica. No existe endpoint de borrado.
