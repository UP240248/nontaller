# Respaldos y restauración — propuesta pendiente

No se accedió a bases reales ni se ejecutaron respaldos o migraciones. Antes de importar el anterior: aprobación específica, inventario, respaldo consistente, checksum y restauración en base aislada. Respaldar también archivos de evidencia y su relación con la BD; proteger cifrado, acceso y claves por canales externos al repositorio.

RPO, RTO, frecuencia, retención, almacenamiento y responsables deben acordarse con Terrabus. No inventar SLAs. Probar restauración y conciliación de recuentos, relaciones, auditoría y costos antes de considerar operativo el procedimiento. Un dump sin restauración demostrada no prueba recuperabilidad. Mantener el origen y reversibilidad durante cualquier migración aprobada.
