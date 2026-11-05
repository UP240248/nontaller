# Guía sencilla para documentar TallerBus con capturas


Haz la acción → toma la captura → escribe un comentario breve.


## Antes de comenzar


Esta guía es para crear tu documento de evidencias. Sigue las fichas en orden: realiza la acción, toma la captura indicada, pégala en el espacio y escribe una o dos líneas sobre lo que observaste.

En Windows usa Windows + Shift + S para recortar la pantalla. En Word selecciona el texto del recuadro, elimínalo y pega con Ctrl + V. Mantén visible el título o el dato que se está comprobando; evita que la imagen supere unos 7 cm de alto.

Los comentarios incluidos son ejemplos. Úsalos solo si eso ocurrió y ajústalos a tu resultado. Si algo falla, captura el error y escribe qué intentabas hacer; no marques ese paso como correcto.

Trabaja con datos ficticios, preferentemente en la demo (http://localhost:4202). Si aún no está preparada, con Docker abierto y desde tallerbus ejecuta npm.cmd run demo:setup y después npm.cmd run demo. Las cuentas de cada rol se consultan localmente en .local/demo-accounts.json; no pegues sus contraseñas en la evidencia.

Para cambiar de rol, cierra sesión y entra con la siguiente cuenta. Usa el mismo autobús, falla, orden y refacción a lo largo de las fichas. Si un nombre o código ya existe, cambia su número y anótalo abajo.


## Datos que usarás


Nombre de quien prueba: ____________________

Fecha: ____________________

Autobús y placas utilizados: ____________________

Usuario Operador de prueba: ____________________

Mecánico asignado: ____________________

Referencia de la orden: ____________________

Código de refacción: ____________________

Nombre del mantenimiento: ____________________


## 01. Pantalla de inicio de sesión


**Entra como:** Sin iniciar sesión


**Haz esto:**

1. Abre TallerBus en el navegador. En la demo usa http://localhost:4202.

2. Deja visibles los campos de usuario y contraseña y el botón para entrar. Todavía no inicies sesión.


**Toma esta captura:** La pantalla completa de login, con sus campos y el botón Entrar a TallerBus.


[PEGA AQUÍ TU CAPTURA]


**Comentario de ejemplo:** La pantalla de inicio solicita usuario y contraseña para ingresar.


**Mi comentario:** ____________________


**Resultado:** ☐ Correcto ☐ Con problema ☐ No realizado


## 02. Mensaje al escribir una contraseña incorrecta


**Entra como:** Cuenta de Administración


**Haz esto:**

1. Escribe el usuario de Administración con una contraseña equivocada y pulsa Entrar a TallerBus.

2. Toma la captura del mensaje. Después corrige los datos para poder continuar.


**Toma esta captura:** El mensaje de acceso rechazado junto al formulario; la contraseña debe permanecer oculta.


[PEGA AQUÍ TU CAPTURA]


**Comentario de ejemplo:** El sistema rechazó el acceso con datos incorrectos y permitió volver a intentarlo.


**Mi comentario:** ____________________


**Resultado:** ☐ Correcto ☐ Con problema ☐ No realizado


## 03. Inicio y menú de Administración


**Entra como:** Administración


**Haz esto:**

1. Ingresa con la cuenta de Administración correcta.

2. Revisa el nombre del usuario, su rol, el menú y los indicadores de Inicio.


**Toma esta captura:** La pantalla de Inicio con el usuario conectado, los indicadores y el menú.


[PEGA AQUÍ TU CAPTURA]


**Comentario de ejemplo:** La cuenta de Administración ingresó y se mostraron sus opciones de trabajo.


**Mi comentario:** ____________________


**Resultado:** ☐ Correcto ☐ Con problema ☐ No realizado


## 04. Registrar un autobús para la prueba


**Entra como:** Administración


**Haz esto:**

1. Entra a Autobuses y pulsa Registrar autobús.

2. Usa número PRUEBA-01, placas PRB001, marca y modelo ficticios, 1,000 km y estado Habilitado. Si ya existen, usa un número y placas nuevos y anótalos.

3. Guarda y abre Ver autobús para revisar el registro.


**Toma esta captura:** El detalle del autobús guardado con su número económico, kilometraje y estado.


[PEGA AQUÍ TU CAPTURA]


**Comentario de ejemplo:** Se registró el autobús de prueba y sus datos se conservaron correctamente.


**Mi comentario:** ____________________


**Resultado:** ☐ Correcto ☐ Con problema ☐ No realizado


## 05. Crear un usuario Operador


**Entra como:** Administración


**Haz esto:**

1. Entra a Usuarios y pulsa Crear usuario.

2. Escribe nombre Operador de prueba, usuario operador.prueba01, rol Operador y una contraseña propia de al menos ocho caracteres. Si el usuario ya existe, cambia el sufijo.

3. Guarda y busca la cuenta en la lista. Conserva la contraseña solo para iniciar sesión, sin escribirla en este documento.


**Toma esta captura:** La fila del usuario creado con nombre, usuario de acceso, rol y estado; no captures la contraseña.


[PEGA AQUÍ TU CAPTURA]


**Comentario de ejemplo:** Se creó la cuenta de prueba con usuario y nombre del empleado, sin solicitar correo.


**Mi comentario:** ____________________


**Resultado:** ☐ Correcto ☐ Con problema ☐ No realizado


## 06. Asignar el autobús al operador


**Entra como:** Administración


**Haz esto:**

1. Desde Usuarios abre Autobuses autorizados del nuevo operador.

2. Selecciona el autobús de la captura 04 y guarda la asignación con un motivo de prueba.

3. Comprueba que aparezca dentro de sus unidades autorizadas.


**Toma esta captura:** El operador y su autobús seleccionado o el aviso de asignación guardada.


[PEGA AQUÍ TU CAPTURA]


**Comentario de ejemplo:** El operador quedó autorizado para reportar fallas del autobús asignado.


**Mi comentario:** ____________________


**Resultado:** ☐ Correcto ☐ Con problema ☐ No realizado


## 07. Preparar una falla con foto


**Entra como:** Operador de prueba


**Haz esto:**

1. Cierra la sesión de Administración e ingresa con el operador creado en la captura 05.

2. Abre Reportar falla, selecciona el autobús autorizado, escribe tipo Frenos y descripción: Se escucha ruido al frenar; reporte de prueba.

3. Selecciona una imagen PNG/JPEG menor a 5 MB y toma la captura de su vista previa. Después pulsa Guardar reporte.


**Toma esta captura:** El formulario de reporte lleno, el autobús autorizado y la vista previa de la foto, antes de guardar.


[PEGA AQUÍ TU CAPTURA]


**Comentario de ejemplo:** El operador pudo elegir su autobús autorizado y previsualizar una foto antes de guardar la falla.


**Mi comentario:** ____________________


**Resultado:** ☐ Correcto ☐ Con problema ☐ No realizado


## 08. Consultar la falla guardada


**Entra como:** Operador de prueba


**Haz esto:**

1. Vuelve a Mis reportes después de guardar.

2. Busca la falla que acabas de crear y revisa que figure como Pendiente.

3. Toma la captura del listado y después pulsa Ver reporte para continuar.


**Toma esta captura:** La fila de la falla con la unidad, descripción, estado Pendiente y el botón Ver reporte.


[PEGA AQUÍ TU CAPTURA]


**Comentario de ejemplo:** El reporte se guardó como pendiente y puede abrirse mediante un botón visible.


**Mi comentario:** ____________________


**Resultado:** ☐ Correcto ☐ Con problema ☐ No realizado


## 09. Ver una foto sin descargarla


**Entra como:** Operador de prueba


**Haz esto:**

1. En el detalle de la falla, localiza la miniatura de la foto.

2. Púlsala para verla en grande dentro de la aplicación. Toma la captura y cierra el visor.


**Toma esta captura:** El visor abierto con la imagen ampliada y el botón Cerrar foto.


[PEGA AQUÍ TU CAPTURA]


**Comentario de ejemplo:** La fotografía se pudo ampliar dentro de TallerBus sin descargarla.


**Mi comentario:** ____________________


**Resultado:** ☐ Correcto ☐ Con problema ☐ No realizado


## 10. Eliminar una foto equivocada


**Entra como:** Operador que subió la foto


**Haz esto:**

1. En el reporte pulsa Eliminar foto. Primero elige Cancelar y comprueba que siga ahí.

2. Vuelve a pulsar Eliminar foto y ahora confirma.

3. Actualiza el reporte y revisa que ya no aparezca.


**Toma esta captura:** El apartado de evidencias después de eliminar, con el aviso de eliminación o sin la miniatura.


[PEGA AQUÍ TU CAPTURA]


**Comentario de ejemplo:** Cancelar conservó la foto; al confirmar su eliminación dejó de aparecer en el reporte.


**Mi comentario:** ____________________


**Resultado:** ☐ Correcto ☐ Con problema ☐ No realizado


## 11. Evaluar y dar prioridad a la falla


**Entra como:** Mecánico


**Haz esto:**

1. Cierra la sesión del operador e ingresa como Mecánico.

2. En Fallas abre el reporte de Frenos del autobús de prueba.

3. Elige prioridad Alta, escribe evaluación: Se requiere revisar el sistema de frenos, indica un motivo y guarda.


**Toma esta captura:** La falla con su prioridad y evaluación mecánica ya guardadas.


[PEGA AQUÍ TU CAPTURA]


**Comentario de ejemplo:** El mecánico evaluó el reporte y se conservó la prioridad asignada.


**Mi comentario:** ____________________


**Resultado:** ☐ Correcto ☐ Con problema ☐ No realizado


## 12. Crear la orden y asignar al mecánico


**Entra como:** Logística


**Haz esto:**

1. Cierra sesión e ingresa como Logística. Desde la falla evaluada abre Crear orden, o entra a Órdenes de trabajo y consulta las fallas del autobús.

2. Selecciona la falla de prueba, escribe título Reparación de frenos de prueba y guarda.

3. En la orden elige al mecánico cuya cuenta usarás después, escribe un motivo y guarda la asignación. Anota su nombre.


**Toma esta captura:** La orden guardada con su título, autobús, falla vinculada y mecánico asignado.


[PEGA AQUÍ TU CAPTURA]


**Comentario de ejemplo:** Se creó la orden de trabajo y quedó asignada al mecánico responsable.


**Mi comentario:** ____________________


**Resultado:** ☐ Correcto ☐ Con problema ☐ No realizado


## 13. Marcar la reparación en proceso


**Entra como:** Mecánico asignado


**Haz esto:**

1. Ingresa con la cuenta del mecánico asignado en la captura 12 y abre la orden de prueba.

2. Pulsa Iniciar trabajo; escribe diagnóstico: Revisión del sistema de frenos de la unidad y motivo Inicio de reparación de prueba.

3. Confirma y revisa que la orden esté En proceso.


**Toma esta captura:** La orden o la falla con el estado En proceso.


[PEGA AQUÍ TU CAPTURA]


**Comentario de ejemplo:** El mecánico asignado inició la reparación y el estado cambió a En proceso.


**Mi comentario:** ____________________


**Resultado:** ☐ Correcto ☐ Con problema ☐ No realizado


## 14. Registrar una refacción


**Entra como:** Logística


**Haz esto:**

1. Ingresa como Logística y abre el Catálogo de refacciones.

2. Registra código PR-FIL-01, descripción Filtro de prueba, unidad pieza y mínimo 2. Si el código ya existe, usa uno nuevo para empezar con saldo cero.

3. Guarda y busca la refacción creada.


**Toma esta captura:** El registro del catálogo con el código, descripción y unidad de medida.


[PEGA AQUÍ TU CAPTURA]


**Comentario de ejemplo:** Se registró una refacción con código único para usarla en las pruebas de inventario.


**Mi comentario:** ____________________


**Resultado:** ☐ Correcto ☐ Con problema ☐ No realizado


## 15. Ingresar piezas al inventario


**Entra como:** Logística


**Haz esto:**

1. En Inventario elige Registrar entrada y selecciona la refacción de la captura 14.

2. Registra 10 piezas, costo unitario 100 MXN y un motivo de prueba. Guarda.

3. Actualiza Existencias y busca esa refacción. No uses otras operaciones sobre ella hasta terminar este recorrido.


**Toma esta captura:** La existencia de la refacción después de la entrada: 10 piezas y, cuando se muestre, su valor de 1,000 MXN.


[PEGA AQUÍ TU CAPTURA]


**Comentario de ejemplo:** La entrada registrada dejó 10 piezas disponibles con un valor de 1,000 MXN.


**Mi comentario:** ____________________


**Resultado:** ☐ Correcto ☐ Con problema ☐ No realizado


## 16. Entregar piezas a la reparación


**Entra como:** Logística


**Haz esto:**

1. En Inventario elige Entregar a orden.

2. Selecciona la orden de frenos que sigue En proceso y entrega 2 piezas de la refacción de prueba, con motivo.

3. Guarda y vuelve a revisar las existencias.


**Toma esta captura:** La refacción con saldo 8 después de entregar las 2 piezas.


[PEGA AQUÍ TU CAPTURA]


**Comentario de ejemplo:** Al entregar dos piezas a la orden, la existencia bajó de 10 a 8.


**Mi comentario:** ____________________


**Resultado:** ☐ Correcto ☐ Con problema ☐ No realizado


## 17. Devolver una pieza sobrante


**Entra como:** Logística


**Haz esto:**

1. En Movimientos busca la entrega de 2 piezas de la captura 16.

2. Pulsa Devolver de esta entrega, indica 1 pieza y el motivo Sobrante de prueba. Guarda.

3. Vuelve a Existencias y revisa la cantidad.


**Toma esta captura:** La refacción con saldo 9 después de la devolución.


[PEGA AQUÍ TU CAPTURA]


**Comentario de ejemplo:** La devolución repuso una pieza al almacén y la existencia quedó en 9.


**Mi comentario:** ____________________


**Resultado:** ☐ Correcto ☐ Con problema ☐ No realizado


## 18. Registrar una compra sin proveedor


**Entra como:** Logística


**Haz esto:**

1. Abre Compras y Nueva compra. Deja sin seleccionar proveedor y deja la referencia opcional vacía.

2. Agrega 5 piezas de la misma refacción a 100 MXN cada una; indica un motivo y elige registrar la compra como ya recibida.

3. Guarda con Registrar compra e ingresar piezas. Revisa la compra y verifica también que la existencia sea 14.


**Toma esta captura:** El detalle de la compra guardada, con su referencia generada, estado Recibida y partida de 5 piezas.


[PEGA AQUÍ TU CAPTURA]


**Comentario de ejemplo:** Se registró una compra recibida sin exigir proveedor y la existencia aumentó de 9 a 14 piezas.


**Mi comentario:** ____________________


**Resultado:** ☐ Correcto ☐ Con problema ☐ No realizado


## 19. Guardar una ficha de pieza con foto


**Entra como:** Logística


**Haz esto:**

1. Abre Fichas con foto y agrega una pieza de la refacción de prueba.

2. Sube una imagen, escribe condición En buen estado, elige situación En uso y escribe el autobús de prueba. Puedes dejar vacío el costo aproximado.

3. Guarda y abre o localiza la ficha.


**Toma esta captura:** La ficha guardada con foto, condición, situación y unidad.


[PEGA AQUÍ TU CAPTURA]


**Comentario de ejemplo:** La ficha conservó la foto, la condición y el autobús en el que se usa la pieza.


**Mi comentario:** ____________________


**Resultado:** ☐ Correcto ☐ Con problema ☐ No realizado


## 20. Finalizar la reparación correctiva


**Entra como:** Mecánico asignado


**Haz esto:**

1. Ingresa como el mecánico asignado y abre la orden de frenos. Pulsa Finalizar reparación.

2. Escribe trabajo Se revisaron y ajustaron los frenos, observaciones Prueba final sin pendientes y un motivo. Registra 30 minutos de mano de obra y una refacción: Filtro de prueba, cantidad 1, unidad pieza.

3. Confirma el cierre. La entrega de 2 menos la devolución de 1 ya documenta esa pieza; finalizar no debe descontarla otra vez.


**Toma esta captura:** La orden con estado Finalizada y el apartado Reparación finalizada con el trabajo realizado.


[PEGA AQUÍ TU CAPTURA]


**Comentario de ejemplo:** La orden quedó finalizada y conservó el trabajo realizado, las observaciones y las refacciones descritas.


**Mi comentario:** ____________________


**Resultado:** ☐ Correcto ☐ Con problema ☐ No realizado


## 21. Guardar un mantenimiento preventivo


**Entra como:** Administración


**Haz esto:**

1. Ingresa como Administración y entra a Mantenimiento → Nuevo mantenimiento.

2. Elige el autobús de prueba, nombre Revisión mensual de prueba, fecha de hoy y control Por fecha. Agrega las tareas Revisar niveles y Verificar fugas.

3. Selecciona un mecánico activo y pulsa Guardar mantenimiento.


**Toma esta captura:** El seguimiento del mantenimiento guardado, su unidad, responsables y tareas todavía pendientes.


[PEGA AQUÍ TU CAPTURA]


**Comentario de ejemplo:** Se guardó un mantenimiento con autobús, fecha, tareas y responsable en un solo paso.


**Mi comentario:** ____________________


**Resultado:** ☐ Correcto ☐ Con problema ☐ No realizado


## 22. Guardar un avance del mantenimiento


**Entra como:** Logística


**Haz esto:**

1. Ingresa como Logística y abre el mantenimiento de la captura 21.

2. Pulsa Iniciar mantenimiento; marca solamente Revisar niveles y pulsa Guardar avances.

3. Actualiza el seguimiento para comprobar que la marca se conserve.


**Toma esta captura:** El estado En proceso y el contador 1 de 2 tareas completadas, después de guardar.


[PEGA AQUÍ TU CAPTURA]


**Comentario de ejemplo:** El avance se guardó y se mantuvo al actualizar; quedó una tarea pendiente.


**Mi comentario:** ____________________


**Resultado:** ☐ Correcto ☐ Con problema ☐ No realizado


## 23. Finalizar el mantenimiento y confirmar próxima fecha


**Entra como:** Mecánico


**Haz esto:**

1. Ingresa como Mecánico, abre el mismo mantenimiento, marca Verificar fugas y guarda los avances.

2. Pulsa Finalizar mantenimiento, escribe Se revisaron niveles y fugas; servicio concluido y confirma la fecha realizada. Revisa que proponga un mes después; puedes cambiar esa próxima fecha.

3. Confirma la finalización y revisa el mensaje del resultado.


**Toma esta captura:** El aviso Mantenimiento finalizado o el servicio marcado como finalizado en el seguimiento.


[PEGA AQUÍ TU CAPTURA]


**Comentario de ejemplo:** El mantenimiento se finalizó con las tareas completas y se guardó su próxima fecha.


**Mi comentario:** ____________________


**Resultado:** ☐ Correcto ☐ Con problema ☐ No realizado


## 24. Consultar el historial de mantenimientos


**Entra como:** Mecánico


**Haz esto:**

1. En Mantenimiento abre la pestaña Historial de servicios.

2. Busca el autobús o nombre del mantenimiento de prueba.

3. Si quieres, elige el mes en que lo realizaste y pulsa Buscar.


**Toma esta captura:** La fila del servicio con el autobús, fecha realizada, kilometraje de cierre y próxima fecha.


[PEGA AQUÍ TU CAPTURA]


**Comentario de ejemplo:** El historial permite comprobar que el autobús recibió mantenimiento y cuándo le corresponde el siguiente.


**Mi comentario:** ____________________


**Resultado:** ☐ Correcto ☐ Con problema ☐ No realizado


## 25. Consultar el uso y costo de piezas


**Entra como:** Contabilidad


**Haz esto:**

1. Ingresa como Contabilidad y abre Órdenes de trabajo.

2. Busca Reparación de frenos de prueba y pulsa Ver orden.

3. Baja a Entregas y devoluciones de almacén y revisa 2 piezas entregadas, 1 devuelta y el costo neto.


**Toma esta captura:** Los movimientos de la orden y su costo neto de refacciones: 100 MXN.


[PEGA AQUÍ TU CAPTURA]


**Comentario de ejemplo:** Contabilidad pudo consultar en qué orden se usaron las piezas y su costo neto de 100 MXN.


**Mi comentario:** ____________________


**Resultado:** ☐ Correcto ☐ Con problema ☐ No realizado


## 26. Exportar un reporte


**Entra como:** Contabilidad


**Haz esto:**

1. En Reportes selecciona Costos de refacciones por autobús. En Buscar en el reporte escribe el número del autobús de prueba y pulsa Consultar reporte.

2. Revisa el costo neto de la unidad y pulsa la opción de exportar CSV.

3. Abre el archivo descargado en Excel o en un visor de hojas de cálculo; verifica encabezados y datos.


**Toma esta captura:** El archivo CSV abierto con el autobús de prueba y su costo. Si no tienes visor, captura el reporte y la descarga completada y anótalo.


[PEGA AQUÍ TU CAPTURA]


**Comentario de ejemplo:** El reporte se pudo descargar y sus datos coinciden con el uso registrado de las refacciones.


**Mi comentario:** ____________________


**Resultado:** ☐ Correcto ☐ Con problema ☐ No realizado


## 27. Revisar los cambios registrados


**Entra como:** Administración


**Haz esto:**

1. Ingresa como Administración y abre Auditoría.

2. Localiza cambios recientes de esta prueba, como el alta de usuario o el cierre del mantenimiento.

3. Revisa que aparezcan acción, responsable y fecha.


**Toma esta captura:** El registro de auditoría con una acción de prueba, su usuario responsable y fecha.


[PEGA AQUÍ TU CAPTURA]


**Comentario de ejemplo:** Las acciones realizadas quedaron registradas con su responsable y fecha.


**Mi comentario:** ____________________


**Resultado:** ☐ Correcto ☐ Con problema ☐ No realizado


## 28. Comprobar el seguimiento que ve el operador


**Entra como:** Operador de prueba


**Haz esto:**

1. Ingresa con el operador creado al comienzo.

2. Abre Mis reportes y el reporte de Frenos que originó la orden.

3. Revisa que ahora aparezca Finalizada y que no haya controles para que el operador cierre trabajos.


**Toma esta captura:** El reporte del operador con estado Finalizada.


[PEGA AQUÍ TU CAPTURA]


**Comentario de ejemplo:** El operador pudo consultar que su falla ya fue atendida y finalizada.


**Mi comentario:** ____________________


**Resultado:** ☐ Correcto ☐ Con problema ☐ No realizado


## 29. Cerrar la sesión


**Entra como:** Cualquier cuenta que siga abierta


**Haz esto:**

1. Pulsa Cerrar sesión.

2. Comprueba que vuelva el login. Usa Atrás y actualiza la página para verificar que se solicite ingresar de nuevo.


**Toma esta captura:** La pantalla de login después de cerrar la sesión.


[PEGA AQUÍ TU CAPTURA]


**Comentario de ejemplo:** La sesión se cerró y fue necesario iniciar sesión nuevamente para acceder.


**Mi comentario:** ____________________


**Resultado:** ☐ Correcto ☐ Con problema ☐ No realizado


## Antes de entregar

Comprueba que cada ficha tenga una captura real, un comentario sobre lo que ocurrió y un resultado marcado. Si algún paso falló, conserva su evidencia y explica el problema. No continúes con pasos que dependan de un registro que no se guardó. No incluyas contraseñas ni archivos de configuración.
