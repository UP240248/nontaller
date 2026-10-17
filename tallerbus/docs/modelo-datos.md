# Modelo de datos preliminar

**Propuesta, no schema definitivo ni migración ejecutable.** Preguntas previas: ¿varias fallas por orden?, ¿varios almacenes?, ¿quién aprueba compras?, ¿cómo se costea mano de obra?, ¿cómo se vinculan operadores y unidades?, ¿qué reglas preventivas se aplican? Véase decisiones pendientes.

```mermaid
erDiagram
  Usuario }o--|| Rol : tiene
  Rol ||--o{ RolPermiso : concede
  Permiso ||--o{ RolPermiso : define
  Usuario ||--o{ Sesion : inicia
  Autobus ||--o{ Falla : recibe
  Usuario ||--o{ Falla : reporta
  Falla ||--o{ EvidenciaFalla : adjunta
  Autobus ||--o{ OrdenTrabajo : requiere
  OrdenTrabajo o|--o{ Falla : agrupa
  OrdenTrabajo ||--o{ AsignacionMecanico : asigna
  Usuario ||--o{ AsignacionMecanico : participa
  OrdenTrabajo ||--o{ TrabajoRealizado : documenta
  OrdenTrabajo ||--o{ ManoObra : registra
  OrdenTrabajo ||--o{ UsoRefaccion : consume
  Refaccion ||--o{ UsoRefaccion : identifica
  Refaccion ||--o{ MovimientoInventario : registra
  UsoRefaccion o|--|| MovimientoInventario : origina
  Autobus ||--o{ PlanMantenimiento : programa
  PlanMantenimiento ||--o{ TareaPlan : contiene
  PlanMantenimiento ||--o{ EjecucionMantenimiento : ejecuta
  OrdenTrabajo ||--o{ EjecucionMantenimiento : atiende
  Proveedor ||--o{ OrdenCompra : suministra
  OrdenCompra ||--o{ DetalleCompra : contiene
  Refaccion ||--o{ DetalleCompra : solicita
  OrdenCompra ||--o{ RecepcionCompra : recibe
  RecepcionCompra ||--o{ DetalleRecepcion : detalla
  DetalleCompra ||--o{ DetalleRecepcion : satisface
  DetalleRecepcion o|--|| MovimientoInventario : origina
  Usuario ||--o{ EventoAuditoria : realiza
```

El diagrama expresa relaciones propuestas; el movimiento también admite ajuste o devolución sin recepción/consumo. Esas procedencias serán mutuamente excluyentes por validación y restricción según soporte MySQL.

| Entidad | Campos / restricciones preliminares |
|---|---|
| Usuario, Rol, Permiso, RolPermiso | ID estable, identificador de acceso único, hash privado, activo, rol; permisos de acción únicos; combinación rol/permiso única. Un rol por usuario inicialmente, por validar |
| Sesion | Hash de token único, usuario, expiración, revocación; nunca token en auditoría |
| Autobus | ID, número económico único, placas, marca, modelo, kilometraje no negativo, activo, estado operativo, timestamps, versión. Unicidad/normalización de placas pendiente |
| Falla | Autobús, reportante, descripción, fecha, tipo, prioridad confirmada por mecánico, estado, orden opcional, versión. Índices por unidad/estado y responsable/fecha |
| EvidenciaFalla | Falla, autor, clave privada de almacenamiento, MIME validado, tamaño y checksum; sin URL pública |
| OrdenTrabajo | Autobús, diagnóstico, estado propio por acordar, responsables, fechas, versión. Varias fallas por orden propuesta; una falla en máximo una orden; exigir misma unidad |
| AsignacionMecanico | Orden, mecánico, asignador, aceptación y vigencia. Evitar asignaciones activas duplicadas |
| TrabajoRealizado, ManoObra | Orden, autor, descripción/observaciones; horas exactas y tarifa histórica si aprobada. Finalización guarda fecha y responsable |
| Refaccion, MovimientoInventario | SKU único, unidad, mínimo configurable; cantidad exacta, tipo, motivo, responsable, origen único, costo histórico Decimal, idempotency key única |
| UsoRefaccion | Orden, artículo, cantidad y movimiento único; devoluciones con movimiento compensatorio, sin editar historia |
| Proveedor | Identificador, datos comerciales mínimos, contacto protegido, activo |
| OrdenCompra, DetalleCompra | Proveedor, estado por validar, autor; artículos, cantidades y precios Decimal. Sin reglas fiscales ni aprobación inventadas |
| RecepcionCompra, DetalleRecepcion | Orden, responsable, fecha, idempotencia; línea comprada, cantidad recibida y costo histórico. Impedir exceso y recepción duplicada transaccionalmente |
| PlanMantenimiento, TareaPlan | Unidad, tipo, frecuencia por tiempo/km configurable, activo, tareas versionadas; al menos un umbral válido |
| EjecucionMantenimiento | Plan, orden, fecha/km y checklist histórico; una orden no debe generar consumo duplicado |
| EventoAuditoria | Entidad, ID, acción, actor, UTC, motivo y cambios permitidos; índices entidad/ID/fecha y actor/fecha |

## Integridad y ciclo de vida

FK restrictivas para unidades, usuarios, piezas, órdenes y documentos con historial. Preferir desactivación; no cascada sobre registros operativos. Cascade solo para relaciones auxiliares sin historia tras justificación. Guardar createdAt/updatedAt y version donde exista edición concurrente. IDs opacos; UTC con precisión coherente. Índices adicionales se validan con consultas reales.

Falla mantiene **Pendiente → En_proceso → Finalizada**. Propuesta: espera de refacciones como condición de la orden, con eventos de inicio/fin; no añadir un cuarto estado de falla sin aprobación. Finalizar exige trabajo, observaciones, fecha, responsable y declaración explícita de piezas/mano de obra aplicables. No habilita automáticamente la unidad mientras falte política de fallas bloqueantes.

Fuente de costos: consumo real proviene de movimientos de salida vinculados; mano de obra de registros aprobados. Compra/recepción es adquisición, no un segundo gasto por autobús. Estimaciones separadas. No sumar compra y consumo como costo operativo duplicado. Reserva frente a descuento, método de valoración y redondeo pendientes.

Stock se deriva de movimientos o saldo materializado validado dentro de la misma transacción; impedir negativos mediante bloqueo/actualización condicional y comprobar filas afectadas. Recepción y consumo tienen claves de idempotencia únicas; reintentar no duplica efectos. Pruebas de concurrencia requeridas antes de considerar listo el módulo.

Prisma schema y SQL versionado se escribirán por fase después de validar el alcance; restricciones que Prisma no exprese deberán vivir en migraciones SQL compatibles y probadas. No hay autorización para migrar datos productivos.

## Implementado en Fase 1

El schema y la migración inicial implementan User, enum Role, Session, AuditEvent y AdminLock. Los otros modelos del ER son preliminares. Los permisos base se expresan mediante guards por rol, sin tablas de permisos granulares todavía. AuditEvent solo almacena las proyecciones permitidas de usuarios y acciones, no contraseñas ni tokens. Session almacena hash y vencimiento; AdminLock contiene una fila fija como mutex transaccional para preservar el último administrador.

## Implementado en Fase 2

Autobus y enum EstadoOperativo están en schema y migración `20261017200000_fleet`. Placas y número económico únicos, índices activo/estado y fecha/ID. AuditEvent incorpora busId opcional y FK restrictiva para las mutaciones de unidades, conservando compatibilidad con los eventos de identidad existentes. `20261017200100_fleet_checks` añade CHECK de kilometraje no negativo y versión positiva, que Prisma no representa en schema.

La activación no afecta el estado; todos los cambios usan version y eventos con antes/después, actor, UTC y motivo. No se implementaron aún Falla, OrdenTrabajo, costos ni mantenimiento. El detalle solo muestra resumen e historial reales; no presenta pestañas vacías para dominios futuros.
