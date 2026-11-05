# Inventario y compras: guía rápida — 3 de noviembre de 2026

## Cómo cambiar de sección

Usa las subpestañas de **Secciones de inventario**, visibles tanto en Inventario como en Catálogo, Fichas, Compras y Proveedores. Tienen borde y fondo de botón; la actual está en azul con marca amarilla y etiqueta **Actual**. Las opciones corresponden a tu rol. Cada una incluye una descripción breve. El botón Registrar/Agregar de cada pantalla realiza la acción; las subpestañas sirven para abrir otra sección.

## ¿Dónde registro cada cosa?

| Quiero… | Abro… |
|---|---|
| Registrar un tipo de refacción, como filtro de aceite | Inventario → Catálogo de refacciones |
| Identificar una pieza física con foto y condición | Inventario → Fichas con foto |
| Consultar cuántas piezas hay | Inventario → Existencias |
| Registrar piezas que compré | Compras → Nueva compra |
| Entregar piezas a una reparación | Inventario → Entregar a orden |
| Regresar sobrantes | Inventario → Devolver sobrantes |

## Ficha de una pieza: no necesitas inventar un código

Primero selecciona su tipo de refacción del catálogo. Escribe su condición libremente: nueva, desgastada, por revisar, etc. **Número de serie o etiqueta es opcional**: si lo dejas vacío, TallerBus genera un identificador. Al editar y dejarlo vacío, conserva el identificador que ya tenía.

Puedes agregar foto PNG/JPEG de hasta 5 MB, observaciones y costo aproximado MXN. Dejar el costo vacío significa **Pendiente**, no cero. Este importe es informativo y visible para Administración, Logística y Mecánicos; no sustituye el costo contable.

Situaciones disponibles: **Pendiente de revisión**, **Disponible**, **En uso en una unidad**, **Retirada / baja**. Para una pieza en uso indica el número económico registrado en Autobuses. **Actualizar pieza** permite cambiar su condición, ubicación y foto. Retirar conserva su historial.

Las fichas describen piezas individuales; crearlas o retirarlas no cambia las cantidades del almacén. Las entradas, entregas y devoluciones las registra Logística.

## Compras: elige si las piezas ya llegaron

1. Abre **Compras → Nueva compra**.
2. Elige **Ya recibí todas las piezas** o **Llegarán después**.
3. Si no tienes un proveedor dado de alta, deja **Compra ocasional / sin proveedor registrado**. Puedes escribir el nombre de la tienda o vendedor, o dejarlo pendiente. No se crea un proveedor ficticio.
4. La referencia de ticket/factura es opcional. Si no tienes una, el sistema genera un folio.
5. Selecciona las refacciones por nombre, cantidad y costo unitario MXN. Puedes buscar por descripción; no necesitas conocer su código. Se muestra el total antes de guardar. Usa punto decimal.
6. Explica el motivo de la compra y guarda.

**Registrar compra e ingresar piezas** autoriza la compra como Logística y suma al almacén lo recibido en una sola operación. **No registres otra entrada por esas piezas**.

**Guardar pedido pendiente** autoriza el pedido, pero no cambia las existencias. Cuando llegue, abre Ver compra y elige **Recibir todo lo pendiente**, o captura cantidades parciales y pulsa **Confirmar cantidades capturadas**. No puedes recibir más de lo pedido.

**Solo preparar un borrador** es una opción para guardar sin autorizar todavía. Después pulsa Aprobar compra y registra su recepción. Logística puede aprobar compras propias.

Puedes cancelar antes de recibir piezas, con motivo y confirmación. No se incluyen impuestos, descuentos, pagos ni devolución a proveedor.

## Existencias, entregas y devoluciones

**Registrar entrada** incorpora piezas sin compra registrada, con cantidad y costo. **Entregar a orden** descuenta lo que sale hacia una orden abierta/en proceso. Busca por título o número económico; desde una orden también puedes abrir una entrega con esa orden seleccionada.

**Devolver sobrantes** exige elegir la entrega original y limita la devolución a lo pendiente; conserva su costo histórico. Se permite después de cerrar una orden. El pendiente de devolver es un máximo, no una obligación de devolver piezas utilizadas.

**Ajustar conteo** corrige una diferencia física, con motivo y sin stock negativo. Solo Logística opera el almacén y las compras.

## Contabilidad

Abre **Inventario (consulta)** para cantidades y valoración; **Compras (consulta)** para compras y recepciones, incluidas las ocasionales. Usa Consultar reporte y Exportar CSV con filtros. Contabilidad no registra movimientos ni compras y no ve contactos privados de proveedores.

## Si falla una operación

Lee el mensaje dentro del formulario. Si hubo un error de red y no sabes si se guardó, conserva el formulario y reintenta sin cambiar los datos; revisa el historial antes de iniciar otra operación. Cerrar sin guardar no guarda un registro en la base de datos.

## Actualizar tu instalación

Detén el servidor, abre Docker y ejecuta desde la carpeta tallerbus:

```powershell
git pull --ff-only
npm.cmd run setup
npm.cmd run dev
```

Setup aplica la migración que permite compras ocasionales. Conserva la base y los registros existentes.
