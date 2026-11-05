# Manuales de TallerBus / Terrabus

Documentos Word editables, edición 2.0 del 27 de octubre de 2026. Incluyen la actualización de acceso por usuario y contraseña de mínimo 8 caracteres. El correo ya no es un campo de cuenta.

- [Manual técnico](Manual_tecnico_TallerBus.docx): instalación Windows, arquitectura, seguridad, modelo de datos, API, pruebas y recuperación.
- [Manual para empleados](Manual_empleados_TallerBus.docx): procedimientos por rol, ejemplos y resolución de errores.
- [Ambos documentos en ZIP](Manuales_TallerBus.zip).

En GitHub abre el archivo y selecciona **Download raw file** (icono de descarga); GitHub no muestra una vista previa de Word. Abre el archivo descargado desde Word o LibreOffice. Si descargas el ZIP, extrae los archivos primero.

En una copia local existente ejecuta `git pull --ff-only` desde el repositorio; los documentos quedan en `tallerbus/docs/manuales/`. No contienen credenciales ni datos privados.

Incluyen el anexo de Inventario por tareas del 28 de octubre de 2026: consultas de Contabilidad y secciones Existencias, Movimientos y Compras para Logística.

## Manual para tester · 5 de noviembre de 2026

Guía actual de pruebas manuales con **54 casos**, pasos por módulo/rol, resultados esperados, datos ficticios, evidencias y criterios de aceptación. Incluye los cambios de mantenimiento, fotos y botones visibles.

- [Manual Word editable](Manual_tester_TallerBus.docx).
- [Manual PDF](Manual_tester_TallerBus.pdf).
- [Plan y registro de resultados en Excel](Plan_pruebas_TallerBus.xlsx): hojas Corrida, Casos, Errores y Resumen. Todos los casos comienzan en **No ejecutado**.
- [Paquete de tester en ZIP](Paquete_tester_TallerBus.zip): Word, PDF y Excel. Extraer antes de abrir.

En GitHub usa **Download raw file** para descargar los archivos; no copies el contenido de la página de vista previa. El PDF se puede abrir directamente en un navegador. Los resultados se llenan con la ejecución real del tester; los documentos no certifican una prueba en su computadora.

La ejecución manual se plantea sobre la demo (`localhost:4202`), separada de los datos habituales. Fuente de texto: [manual-tester.md](../manual-tester.md); catálogo estructurado: [casos-prueba.json](../qa/casos-prueba.json).
