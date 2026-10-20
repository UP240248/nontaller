# Decisiones pendientes

## Para iniciar Fase 1

1. **Resuelto:** el usuario autorizó continuar desde cero el 17 de octubre de 2026. No es necesario recuperar el anterior para avanzar. Se adjuntó `taller-autobuses-main.zip`, pero supera el límite de transferencia de 32 MiB y no se pudo inspeccionar. Su revisión queda opcional; no se presume reutilización.
2. **Resuelto:** el usuario aprobó iniciar fundamentos y los permisos iniciales. Implementadas sesiones opacas revocables conforme a la propuesta documentada.
3. **Resuelto:** Administración crea/desactiva usuarios, asigna roles y revoca sesiones; los demás roles solo perfil propio. El primer administrador se crea por bootstrap interactivo o fixtures explícitos de desarrollo. No enviar contraseñas en chat.

Versiones y scripts de Fase 1 están fijados y documentados. MySQL local usa configuración privada generada; el alojamiento definitivo sigue pendiente. Los valores locales de expiración y límites de login son parámetros técnicos ajustables, no políticas comerciales aprobadas.

## Por módulo (no bloquear fundamentos)

| Módulo | Preguntas concretas | Comportamiento conservador hasta validar |
|---|---|---|
| Flota | **Resuelto:** placas únicas; Administración/Logística gestionan datos y activación; los tres roles cambian estado | Implementado. Normalización técnica: mayúsculas, sin espacios/guiones; número económico en mayúsculas y trim; sin borrado |
| Fallas/órdenes | **Resuelto:** varias fallas de una unidad por orden; Administración/Logística asignan; Mecánico finaliza; fallas abiertas no impiden habilitar | Implementado con finalización del mecánico asignado, prioridad confirmada por Mecánico y espera como condición de orden; sin cambio automático del autobús |
| Operadores | ¿Relación permanente o temporal con unidad? ¿Cómo son entrada/salida? | Reporta una unidad activa por económico conocido y consulta sus propios reportes/fotos; no enumera flota. Asignaciones operador-unidad y check-in/out pendientes |
| Inventario | **Resuelto:** un almacén; descontar al entregar, sin reservas ni negativos; Logística opera; promedio ponderado MXN | Cantidades hasta 3 decimales y valores internos a 6; unidades históricas fijas tras uso |
| Compras | **Resuelto:** Logística aprueba incluso propias; recepción parcial hasta cantidad pedida. Fiscalidad y devolución a proveedor pendientes | Borrador, aprobación explícita, parcial/recibida y cancelación antes de recibir; sin impuestos/descuentos |
| Costos | MXN y Decimal resueltos; Fase 6: Logística/Contabilidad consultan/exportan reportes financieros. Tarifas laborales/fiscalidad pendientes | Consumo neto desde entregas/devoluciones; sin doble compra/consumo ni importes a Administración |
| Mantenimiento | **Resuelto:** solo kilometraje; Logística crea planes y asigna; servicios/intervalos aún desconocidos | Captura explícita por unidad, sin presets; checklist editable para futuras ejecuciones; mecánico asignado ejecuta |
| Seguridad | ¿Duración de sesión, bloqueo, retención, evidencias, responsables de respaldo? | Denegación por defecto; límites documentados y por validar |
| Operación | ¿Zona horaria empresarial, servidores, sistema operativo, usuarios finales, presupuesto y SLAs? | UTC interno; operación local; sin promesas de capacidad |
| Integraciones | ¿Notificaciones externas, GPS, ERP y formatos oficiales? | Solo coordinación interna; sin WhatsApp ni integraciones no autorizadas |

Las propuestas técnicas son reversibles y no equivalen a aprobación comercial. Registrar cada resolución con responsable, fecha, alcance y documentos afectados.

## Alcance de Fase 2 confirmado

Se implementa la aprobación de los tres puntos de flota. No se habilitan permisos de fases posteriores. Los cambios de estado siguen siendo manuales y con motivo: no se deduce disponibilidad a partir de reparaciones todavía. Estas preguntas se resolvieron posteriormente para Fase 3: finaliza el mecánico asignado y las fallas no bloquean la habilitación manual.

## Decisiones recibidas para Fase 3

El usuario respondió: «administracion y logistica, si, el mecanico, no» a asignación, agrupación, finalización y bloqueo de habilitación, respectivamente. No se aplica el bloqueo que se había recomendado. No se añade bandera de falla bloqueante ni automatismo para habilitar o deshabilitar unidades.

Administración/Logística crean y coordinan órdenes; el mecánico actualmente asignado puede iniciar, registrar espera y finalizar, quedando como responsable del cierre. Una orden agrupa varias fallas del mismo autobús; una falla pertenece como máximo a una orden. La espera no añade un estado nuevo a Falla.

Las reglas de inventario y aprobación de Fase 4 se resolvieron posteriormente; tarifas laborales y fiscalidad siguen pendientes. La Fase 3 solo registra tiempo y piezas descriptivas exactas; no inventa importes, impuestos, stock ni autorizaciones financieras.

## Decisiones recibidas para Fase 4 — 20 de octubre de 2026

El usuario confirmó un almacén, operación por Logística y moneda MXN con costo promedio ponderado. Aclaró expresamente: «Descontar al entregar; sin negativos» y «Aprueba Logística, incluso compras propias». No se implementan reservas ni descuento automático al finalizar reparaciones.

La precisión técnica es de 3 decimales para cantidades y 6 para costo/valor, con redondeo HALF_UP. Una salida total absorbe el residuo de valoración. Las devoluciones de piezas no usadas restituyen la valoración original de su entrega, con límite acumulado. Las compras se reciben hasta lo pendiente, sin excedentes; pueden cancelarse antes de recibir. Estos son controles conservadores de implementación, no reglas fiscales aprobadas.

Pendiente para fases posteriores: tarifas de mano de obra, impuestos/descuentos, pagos, devolución a proveedor, importación de históricos y permisos financieros fuera de los reportes aprobados posteriormente en Fase 6. Administración sigue sin importes. Las piezas descriptivas anteriores no se convierten automáticamente en stock ni en costos.

## Decisiones recibidas para Fase 5 — 20 de octubre de 2026

El usuario respondió «por kilometraje», «si» a gestión/asignación por Logística y «no tengo ni idea» respecto de servicios e intervalos. Después autorizó continuar. No se inventan valores, frecuencias de fabricante ni un catálogo precargado. Logística debe consultar manual/historial/taller y capturar servicio, intervalo en kilómetros, última lectura conocida de servicio y checklist.

El vencimiento se calcula al alcanzar último servicio + intervalo, sin tolerancias supuestas ni dependencia del calendario. Se permite programación anticipada explícita con motivo; hay una sola ejecución abierta por plan. Cada ejecución conserva copia de nombre/intervalo/base/objetivo y tareas. Ediciones del plan se aplican a futuros servicios; el cierre usa el kilometraje actual de flota revisado y el siguiente vencimiento usa el intervalo vigente del plan. No habilita/deshabilita unidades ni genera consumos adicionales.

Pendientes para una política futura: programación por tiempo, tolerancias/avisos anticipados, cambio de odómetro o corrección de cierres, cancelación/reapertura de ejecuciones y servicios normativos específicos. No bloquear la implementación configurable por esos valores no proporcionados. La captura inicial del último servicio no se edita después desde el plan; si fue incorrecta, requiere una futura política de corrección trazable, no alterar historia mediante SQL.

## Decisiones recibidas para Fase 6 — 20 de octubre de 2026

El usuario confirmó «Logística y Contabilidad» a lectura/exportación de compras, valoración de inventario y costos de refacciones por autobús. Se mantiene a Administración sin importes y a Contabilidad sin escritura, contactos privados ni acceso operativo general. Mecánico obtiene reportes de órdenes asignadas; Operador solo propios.

Fechas de reportes operativos: registro de falla/orden; compras: creación de compra y estado actual, con recepción acumulada de esas compras; costos: fecha de los movimientos de entrega/devolución. Inventario/flota/preventivos son consultas actuales, sin reconstrucción histórica por fecha. Los costos excluyen adquisiciones y tarifas laborales inexistentes. Un período de solo devoluciones puede dar neto negativo.

CSV exporta todo el conjunto filtrado hasta 10000 filas; encima exige reducir filtros, nunca trunca silenciosamente. Este límite es técnico. Check-in/out, relación operador-unidad, reportes fiscales/pagos y tarifas laborales siguen pendientes; no se incluyen por suposición.
