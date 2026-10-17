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
| Inventario | ¿Uno o varios almacenes? ¿Reserva o descuento? ¿Unidad fraccionaria? ¿Valoración? ¿Quién ajusta? | No stock negativo; no implementar política financiera sin aprobación |
| Compras | ¿Estados, aprobadores, recepción excedente, devoluciones, impuestos y descuentos? | Sin aprobación automática ni reglas fiscales |
| Costos | ¿Moneda, escala, redondeo, tarifas, estimado vs real y acceso? | Decimal; sin inventar tarifas ni exponer importes a otros roles |
| Mantenimiento | ¿Intervalos, tolerancias, checklists y responsables? | Parámetros configurables sin umbrales ficticios |
| Seguridad | ¿Duración de sesión, bloqueo, retención, evidencias, responsables de respaldo? | Denegación por defecto; límites documentados y por validar |
| Operación | ¿Zona horaria empresarial, servidores, sistema operativo, usuarios finales, presupuesto y SLAs? | UTC interno; operación local; sin promesas de capacidad |
| Integraciones | ¿Notificaciones externas, GPS, ERP y formatos oficiales? | Solo coordinación interna; sin WhatsApp ni integraciones no autorizadas |

Las propuestas técnicas son reversibles y no equivalen a aprobación comercial. Registrar cada resolución con responsable, fecha, alcance y documentos afectados.

## Alcance de Fase 2 confirmado

Se implementa la aprobación de los tres puntos de flota. No se habilitan permisos de fases posteriores. Los cambios de estado siguen siendo manuales y con motivo: no se deduce disponibilidad a partir de reparaciones todavía. Estas preguntas se resolvieron posteriormente para Fase 3: finaliza el mecánico asignado y las fallas no bloquean la habilitación manual.

## Decisiones recibidas para Fase 3

El usuario respondió: «administracion y logistica, si, el mecanico, no» a asignación, agrupación, finalización y bloqueo de habilitación, respectivamente. No se aplica el bloqueo que se había recomendado. No se añade bandera de falla bloqueante ni automatismo para habilitar o deshabilitar unidades.

Administración/Logística crean y coordinan órdenes; el mecánico actualmente asignado puede iniciar, registrar espera y finalizar, quedando como responsable del cierre. Una orden agrupa varias fallas del mismo autobús; una falla pertenece como máximo a una orden. La espera no añade un estado nuevo a Falla.

Antes de Fase 4: confirmar almacenes, reserva vs descuento, valoración de inventario, moneda/redondeo, costos laborales, estados/aprobaciones de compras y recepciones. La Fase 3 solo registra tiempo y piezas descriptivas exactas; no inventa importes, impuestos, stock ni autorizaciones financieras.
