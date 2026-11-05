# Mantenimiento por autobús

Cambio acordado el 5 de noviembre de 2026: Administración, Logística y Mecánico crean, asignan, inician, registran avances y finalizan preventivos. El calendario es la opción principal; los intervalos por kilómetros existentes se conservan. No cambian permisos de correctivos ni financieros.

La pantalla presenta Programación y avisos, Historial de servicios y un detalle con inicio, tareas y cierre. El registro nuevo guarda plan, orden, tareas y asignaciones en una transacción. Un error revierte todo. El calendario almacena fechas sin hora; el historial distingue día realizado de fecha de captura y conserva la próxima fecha acordada para ese servicio.

El próximo mantenimiento se propone un mes calendario después del realizado (31 de enero → último día de febrero). Puede cambiarse al cerrar o editarse después en el plan. Completar requiere todas las tareas guardadas y kilometraje revisado; la unidad y el inventario conservan su flujo independiente. Los recordatorios se muestran en Inicio y Mantenimiento; requieren abrir/actualizar la aplicación.

## Actualizar una instalación local

Con Docker abierto, detener el servidor con Ctrl+C y ejecutar desde `tallerbus`:

```powershell
git pull --ff-only
npm.cmd run setup
npm.cmd run dev
```

Setup genera Prisma, aplica la migración y compila el backend. No borrar `.local`, volúmenes ni bases. La migración agrega fechas y permite intervalos nulos para servicios por fecha, sin borrar planes ni ejecuciones. El arranque verifica la nueva estructura para evitar iniciar con un esquema antiguo.

## Verificación

Las pruebas de API cubren permisos, creación y asignación atómicas, fechas válidas, avances y cierres con conflictos, próximos vencimientos, historial mensual, integridad de stock y conservación de planes por kilómetros. Las pruebas de navegador recorren alta por Administración, avance por Logística, cierre móvil por Mecánico, selección entre más de veinte autobuses y recuperación de errores de carga/guardado. La suite completa de API pasó con 142 pruebas; los ajustes finales se verificaron con 57 pruebas de mantenimiento, reportes y órdenes. También pasaron 21 pruebas unitarias y los recorridos de navegador de mantenimiento (6) y reportes/órdenes (8).
