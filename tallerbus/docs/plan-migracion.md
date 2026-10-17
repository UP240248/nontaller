# Plan de reutilización y migración

No hay componentes anteriores accesibles. Las categorías siguientes son candidatas, no decisiones de reutilización verificadas.

| Componente | Tratamiento candidato | Condición / justificación |
|---|---|---|
| Autenticación e interceptor | Adaptar si supera auditoría | Comprobar hash, expiración, revocación y fugas |
| CRUD de autobuses | Adaptar si supera pruebas | Separar activo de estado operativo y preservar historial |
| Estados y finalización de fallas | Adaptar | Verificar transiciones, campos obligatorios y concurrencia |
| Asignación e historial | Reutilizar si hay evidencia | Probar autorización, atribución y trazabilidad |
| Servicios Angular y estilos | Adaptar | Contratos tipados, accesibilidad y derechos de uso |
| Modelo y migraciones | Evaluar antes de adaptar | No inferir compatibilidad de datos ni ejecutar migraciones antiguas |
| Contratos inseguros o controles solo en UI | Reescribir si se detectan | Autorización obligatoria en backend |
| Datos demo, secretos o artefactos compilados | Descartar de producción si existen | No copiar credenciales ni mezclar fixtures |
| Inventario, compras y mantenimiento | Implementar nuevos si no existen | Dependen de decisiones de negocio |

## Procedimiento reversible propuesto

1. Obtener acceso y documentar versión exacta, pruebas y licencias del anterior.
2. Mantener el anterior intacto; construir en `tallerbus/`, sin sobrescrituras ni borrados.
3. Antes de cualquier migración, pedir autorización específica; inventariar origen y destino, respaldar y demostrar restauración en base aislada.
4. Acordar mapeos de IDs, usuarios, estados, fechas, importes, duplicados y registros huérfanos. Generar informe de discrepancias, sin correcciones silenciosas.
5. Ensayar importación idempotente en staging con recuentos, relaciones y conciliación de costos; verificar rollback con copia restaurada.
6. Solo tras aprobación: ventana de cambio, respaldo final, importación y validación; conservar origen y plan de retorno. No hay autorización de producción en esta fase.
