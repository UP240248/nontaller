# Respaldos y restauración — propuesta pendiente

No se accedió a bases productivas ni se ejecutaron respaldos o migraciones. Antes de importar el anterior: aprobación específica, inventario, respaldo consistente, checksum y restauración en base aislada. Respaldar también archivos de evidencia y su relación con la BD; proteger cifrado, acceso y claves por canales externos al repositorio.

RPO, RTO, frecuencia, retención, almacenamiento y responsables deben acordarse con Terrabus. No inventar SLAs. Probar restauración y conciliación de recuentos, relaciones, auditoría y costos antes de considerar operativo el procedimiento. Un dump sin restauración demostrada no prueba recuperabilidad. Mantener el origen y reversibilidad durante cualquier migración aprobada.

## Evidencias incorporadas en Fase 3

Ahora hay archivos privados relacionados por EvidenciaFalla.storageKey y checksum. Respaldar MySQL y la carpeta EVIDENCE_DIR (o `.local/evidence`) con coherencia temporal y control de acceso. Restaurar metadatos sin archivos deja descargas no disponibles; archivos sin filas son huérfanos. El servidor valida hash y tamaño antes de descargar.

Una transacción fallida compensa eliminando su archivo nuevo. Si el proceso muere entre escritura y commit puede quedar un huérfano; cualquier conciliación futura debe listar primero discrepancias y obtener aprobación antes de borrar archivos de datos. RPO/RTO, retención y ensayo formal de restauración continúan pendientes de Fase 7. No se declara respaldo productivo probado.
