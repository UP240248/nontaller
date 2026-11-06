# Interfaz para celular

Actualización del 6 de noviembre de 2026. TallerBus conserva una sola aplicación web que adapta su presentación al ancho de pantalla.

## Uso

- En pantallas pequeñas, **Abrir menú** despliega las opciones disponibles para tu rol. **Cerrar menú** o Escape lo cierran; elegir una pantalla lo cierra automáticamente.
- Fallas, órdenes, autobuses, usuarios, catálogos, inventario e historiales principales muestran registros como tarjetas, con etiquetas de cada dato y botones visibles. En escritorio conservan las tablas.
- La búsqueda sigue visible; **Más filtros** despliega las opciones adicionales en Fallas, Órdenes, Autobuses y Catálogo. Ocultarlas no borra sus valores.
- En inventario, desliza las subpestañas para cambiar entre existencias, catálogo, fichas, movimientos, compras y proveedores según tus permisos. La sección actual conserva su marca.
- Los formularios y diálogos se ajustan al ancho disponible y permiten desplazamiento vertical. Los controles tienen áreas táctiles amplias y campos de texto de tamaño legible.
- Los reportes financieros conservan la tabla completa para comparar columnas: la indicación de pantalla explica cómo deslizarla horizontalmente. La exportación CSV sigue disponible.

## Probar desde la computadora

Con la aplicación iniciada, abre las herramientas del navegador (F12), activa la vista de dispositivo y prueba anchos de 320 y 390 píxeles. En cada perfil revisa el menú, abre un registro y prueba un formulario. Cierra el formulario con Cancelar si solo quieres revisar la presentación.

La adaptación visual no publica TallerBus en internet ni cambia los puertos del servidor. Para abrir la instalación de la laptop desde un teléfono físico se necesita configurar el acceso entre ambos equipos; `localhost` en el teléfono identifica al teléfono, no a la laptop.

## Actualización

Desde `tallerbus`, detener con Ctrl+C y ejecutar:

```powershell
git pull --ff-only
npm.cmd run setup
npm.cmd run dev
```

Después actualizar el navegador. No requiere reinstalar la base ni cambiar cuentas.

## Verificación del cambio

`tests/e2e/mobile.spec.mjs` verifica menú cerrado por defecto, navegación y Escape, permisos del Operador, tarjetas a 320/390 px, apertura de registros, filtros, ausencia de desbordamiento horizontal y cancelación del formulario preventivo. Las pruebas existentes se adaptan para desplegar el menú cuando navegan desde una pantalla pequeña. La suite completa de navegador verifica los recorridos restantes.

La presentación usa los mismos datos y acciones del servidor. Las etiquetas de las tarjetas se toman de los encabezados vigentes de cada tabla, incluidos los campos condicionales por rol. No cambian las reglas de inventario, reparación o mantenimiento.

## Ejemplos con datos ficticios

- [Fallas en pantalla de celular](images/celular-fallas.png).
- [Inventario en pantalla de celular](images/celular-inventario.png).
