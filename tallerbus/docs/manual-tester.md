# Manual de pruebas de TallerBus / Terrabus

Edición 1.0 · 2026-11-05 · Base funcional 9f1173e

## 1. Objetivo y alcance

Este manual explica cómo probar TallerBus / Terrabus de forma manual y registrar resultados comprobables. Está dirigido a quien hará el trabajo de tester, aunque no programe.

Edición 1.0 · 5 de noviembre de 2026 · Referencia funcional: main, commit 9f1173e. El manual incluye acceso por usuario, unidades autorizadas, fotografías visibles/eliminación, botones grandes y mantenimiento por fecha con permisos de Administración, Logística y Mecánico.

Los resultados descritos son lo que se espera comprobar. Esta documentación no certifica que los casos se hayan ejecutado en tu laptop. La plantilla se entrega con todos los casos en No ejecutado.

Alcance: acceso, usuarios, autobuses, fallas, fotos, órdenes correctivas, inventario, compras, preventivos, reportes, usabilidad, concurrencia y recuperación. No incluye envío de correo, publicación en la red empresarial ni notificaciones fuera de la aplicación.

## 2. Preparar un ambiente de prueba

Usa la demo para la ejecución manual. La base tallerbus_demo está separada de tallerbus, donde están tus datos habituales. La base tallerbus_test se reserva para pruebas automáticas y sus datos se regeneran; no la uses como una demo persistente.

Antes de empezar: Docker Desktop con motor activo; Node 24 compatible con el proyecto; repositorio actualizado; dependencias instaladas. Si es una copia nueva, el responsable técnico ejecuta npm.cmd ci desde tallerbus antes de preparar. No hace falta volver a clonar una copia existente.

Con el servidor anterior detenido por Ctrl+C, abre PowerShell en la carpeta tallerbus de tu copia y ejecuta las instrucciones siguientes. cd debe apuntar a tu ubicación real; el ejemplo no crea una carpeta.

```powershell
cd C:\Proyectos\nontaller\tallerbus
git pull --ff-only
npm.cmd run demo:setup
npm.cmd run demo
```

Abre http://localhost:4202 en una ventana InPrivate/incógnito. Mantén abierta la terminal de la demo. El entorno habitual es localhost:4200; no los confundas. Las cookies de localhost se comparten entre puertos: usa perfiles separados o navegadores distintos para varios usuarios. Dos ventanas InPrivate del mismo navegador pueden compartir sesión.

La demo tiene cuentas por rol con contraseñas aleatorias guardadas localmente. Consulta, solo en tu equipo: notepad .local\demo-accounts.json. Identifica username y password del perfil. No copies ese archivo ni las claves a la documentación o a capturas.

demo:setup prepara/migra/compila y conserva una demo existente: no restablece sus ejemplos ni borra lo que ya probaste. Para repetir la prueba usa identificadores nuevos. No uses seed:dev para “arreglar” una demo ni borres .local o volúmenes.

Para otro día: Docker listo → npm.cmd run demo → localhost:4202. Para detener: Ctrl+C. Si vuelves al entorno habitual, npm.cmd run dev y localhost:4200 con sus propias credenciales.

## 3. Roles y restricciones que debes distinguir

Administración: usuarios, unidades autorizadas, flota, coordinación de correctivos, auditoría y gestión completa de preventivos; no recibe importes financieros por ser administrador.

Logística: flota, unidades autorizadas, coordinación correctiva, inventario/compras y preventivos; consulta y exporta importes financieros. Puede aprobar sus propias compras.

Mecánico: reporta y evalúa fallas; en correctivos inicia/finaliza solo si está asignado. En preventivos puede crear, programar, asignar, guardar tareas y finalizar, aunque no sea el mecánico asignado. Consulta cantidades de inventario y crea/edita catálogo y fichas sin permisos contables.

Operador: reporta solo sobre autobuses activos autorizados y consulta únicamente sus propios reportes y fotos. Administración autoriza inicialmente sus unidades; Administración o Logística pueden reasignarlas.

Contabilidad: consulta/exporta compras, valoración y costos; consulta órdenes, sus materiales y checklist preventivo. No gestiona planes, no entrega piezas ni modifica órdenes.

Una opción oculta, una redirección por rol o un rechazo de acceso pueden ser resultados correctos. Reporta un defecto cuando contradigan esta política, no solo porque un botón no aparezca.

## 4. Datos ficticios y control de la corrida

Asigna un identificador de corrida, por ejemplo QA-20261105-01. Usa ese prefijo en nombres, usuarios, placas, refacciones y motivos. Si repites, cambia el sufijo para evitar conflictos legítimos de unicidad.

Prepara dos autobuses activos QA-A y QA-B con números/placas únicos y lecturas conocidas; dos operadores; un mecánico principal y otro para probar restricciones correctivas. Pueden crearse desde las cuentas demo. Cada usuario nuevo debe tener su propia contraseña de prueba, sin registrarla en el Excel.

Usa una imagen PNG/JPEG de prueba menor a 5 MB, un PDF de muestra y una imagen preparada mayor a 5 MB. No uses fotografías de empleados o documentación privada.

Para inventario usa una refacción nueva de saldo cero: SKU QA-FIL-[corrida], descripción Filtro QA, unidad pieza, mínimo 2. El código de catálogo se captura; no es un código de barras. El identificador de una ficha individual es un dato diferente.

Escenario numérico exclusivo: entrada 10 × 100 = 1,000 MXN; entrega 2 → saldo 8/valor 800; devolución 1 → saldo 9/valor 900 y costo neto de orden 100. Compra recibida 5 × 100 → saldo 14/valor 1,400; pedido 2 × 120 no cambia stock; recibir 1 → saldo 15/valor 1,520; recibir otra → saldo 16/valor 1,640 y promedio 102.50.

No hagas otras entradas, ajustes o consumos sobre esa refacción mientras concilias. Si un caso anterior falla o cambian los datos, bloquea los dependientes o prepara una refacción nueva; no marques como falla un cálculo con una base distinta.

Una ficha con foto/condición describe una pieza física; por sí sola no aumenta ni descuenta existencias. Comprar, entregar, devolver y cerrar una orden son operaciones diferentes. El cierre no vuelve a descontar piezas.

## 5. Cómo ejecutar y documentar un caso

1) Abrir Plan_pruebas_TallerBus.xlsx y completar la hoja Corrida: versión/commit, fecha, tester, ambiente, navegador y resolución. Registrar que la URL sea la demo.

2) Elegir el caso en Casos. Leer objetivo, rol, precondiciones y resultado esperado antes de tocar la pantalla. Iniciar la sesión que corresponda.

3) Ejecutar los pasos en orden y anotar el resultado real. Actualizar o volver a entrar al registro cuando el caso pida comprobar persistencia; un aviso de éxito no basta.

4) Guardar evidencia con identificador, por ejemplo FAL-01_20261105_01.png. Anotar la referencia de la unidad, orden, compra o mantenimiento. Ocultar contraseñas, cookies y datos privados.

5) Marcar Aprobado si el resultado observado coincide; Fallido si contradice el esperado; Bloqueado si no puede evaluarse por una precondición o infraestructura; No aplica solo con motivo. Mantener No ejecutado hasta realizarlo.

6) Si falla, registrar un defecto en Errores con su ID y enlazarlo desde el caso. Repetir una vez cuando sea seguro y no genere más cargos o movimientos; consultar primero si el guardado pudo haberse completado.

7) Al recibir una corrección, repetir el caso exacto y los relacionados. Registrar el nuevo resultado y mantener la evidencia anterior; no borrar el historial del defecto.

## 6. Orden recomendado y prueba rápida

Primera revisión (aproximadamente 20–30 minutos, según datos y experiencia): ACC-01, FLO-01, USR-04, FAL-01, FOT-01, FAL-04, MAN-01, MAN-02, MAN-04 y UX-01. Sirve para detectar bloqueos tempranos; no sustituye la corrida completa.

Flujo correctivo con almacén: crear dos fallas del mismo autobús y evaluarlas → ORD-01 → ORD-03 → INV-01 a INV-05 → ORD-05 → ORD-06. Las entregas se hacen antes de cerrar la orden.

Flujo de compras y números: terminar INV-02 a INV-05 → COM-01 → COM-02 → COM-03 → REP-01/02. Evitar cambios ajenos sobre la refacción del escenario.

Flujo preventivo: MAN-01 → MAN-02 → MAN-03 → completar y guardar todas las tareas → MAN-04. Después probar roles, avisos, fechas y conservación de plantillas con casos independientes.

Casos de desactivación, inactividad y fallos de conexión se hacen al final o con cuentas/unidades secundarias. Restablecer la cuenta/unidad de prueba antes de seguir. No desactivar al último administrador.

## 7. Casos de prueba detallados

Catálogo de 54 casos. P0: flujo indispensable, integridad o control de acceso; P1: validaciones, recuperación y uso cotidiano. El orden del catálogo agrupa módulos; para dependencias usa la sección anterior.

En los pasos, Guardar o Finalizar se refiere al control con ese significado en la pantalla. Los textos entre comillas o en negrita no son comandos de PowerShell. Las capturas del tester deben reflejar su propia ejecución.

### ACC-01 · Entrar con cada perfil

**Módulo:** Acceso · **Rol:** Los cinco roles · **Prioridad:** P0

**Antes:** Demo preparada y cuentas locales disponibles.

1. Abrir http://localhost:4202 en una ventana privada.
2. Ingresar usuario y contraseña del perfil seleccionado.
3. Revisar el nombre y rol; cerrar sesión y repetir con los demás perfiles.

**Resultado esperado:** Inicio de sesión correcto para cada cuenta activa; el menú corresponde a su rol y no solicita correo.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### ACC-02 · Contraseña incorrecta y recuperación

**Módulo:** Acceso · **Rol:** Cualquier rol · **Prioridad:** P1

**Antes:** Cuenta activa; probar solo unos pocos intentos.

1. Ingresar un usuario existente con una contraseña equivocada.
2. Revisar el mensaje.
3. Volver a intentar con los datos correctos.

**Resultado esperado:** El primer intento se rechaza con un mensaje comprensible; el segundo permite ingresar. No debe aparecer error interno del servidor.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### ACC-03 · Cerrar sesión y volver atrás

**Módulo:** Acceso · **Rol:** Cualquier rol · **Prioridad:** P0

**Antes:** Sesión iniciada.

1. Abrir un registro al que el perfil tenga acceso.
2. Cerrar sesión.
3. Usar Atrás, actualizar la página e intentar abrir otra vez la dirección del registro.

**Resultado esperado:** Después de actualizar o pedir información protegida se exige iniciar sesión; no se recupera una sesión válida por usar Atrás.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### ACC-04 · Rutas restringidas

**Módulo:** Acceso · **Rol:** Operador y Contabilidad · **Prioridad:** P0

**Antes:** Conocer las rutas /usuarios, /auditoria y /mantenimiento.

1. Iniciar como Operador e intentar esas direcciones.
2. Repetir como Contabilidad.
3. Revisar que tampoco aparezcan acciones administrativas en el menú.

**Resultado esperado:** La interfaz redirige a una pantalla permitida o informa falta de acceso. No permite crear usuarios ni gestionar mantenimiento; no es un error que estos perfiles tengan restricciones.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### USR-01 · Crear cuenta con usuario y nombre

**Módulo:** Usuarios · **Rol:** Administración · **Prioridad:** P0

**Antes:** Existe un autobús QA activo para asignarlo si el rol será Operador.

1. Abrir Usuarios y la opción de agregar.
2. Capturar nombre del empleado, usuario único, contraseña propia de al menos ocho caracteres y rol.
3. Si es Operador, autorizar al menos un autobús; guardar e iniciar sesión con la nueva cuenta.

**Resultado esperado:** La cuenta se guarda, inicia sesión con usuario y conserva su nombre/rol. No se pide correo ni se muestra su contraseña guardada.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### USR-02 · Validar contraseña y usuario repetido

**Módulo:** Usuarios · **Rol:** Administración · **Prioridad:** P1

**Antes:** Cuenta QA creada en USR-01.

1. Intentar otra alta con contraseña de siete caracteres.
2. Corregir la contraseña e intentar usar un usuario existente.
3. Cambiar a un usuario único y guardar.

**Resultado esperado:** Las dos entradas inválidas se rechazan sin duplicar la cuenta; el alta válida se permite.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### USR-03 · Desactivar una cuenta de prueba

**Módulo:** Usuarios · **Rol:** Administración · **Prioridad:** P0

**Antes:** Cuenta QA secundaria abierta en otro perfil de navegador; conservar un administrador activo.

1. Desactivar solamente la cuenta secundaria.
2. Desde su sesión, actualizar o intentar guardar una operación permitida.
3. Intentar iniciar sesión otra vez; después reactivar la cuenta.

**Resultado esperado:** La cuenta desactivada pierde acceso. Reactivarla permite un nuevo inicio de sesión; no se elimina su historial.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### USR-04 · Autorizar varias unidades al operador

**Módulo:** Usuarios · **Rol:** Administración y Logística · **Prioridad:** P0

**Antes:** Dos autobuses QA activos y un Operador QA.

1. Como Administración, autorizar QA-A y QA-B al operador.
2. Como Operador, abrir Reportar falla y revisar la lista de unidades.
3. Como Logística, retirar QA-B; volver a cargar el formulario del Operador.

**Resultado esperado:** Solo aparecen las unidades activas autorizadas. QA-B deja de estar disponible para nuevos reportes; los reportes anteriores conservan su autobús original.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### FLO-01 · Registrar y abrir un autobús

**Módulo:** Autobuses · **Rol:** Administración o Logística · **Prioridad:** P0

**Antes:** Número económico y placas QA únicos.

1. Registrar QA-A con marca/modelo ficticios y 1,000 km.
2. Guardar y buscarlo en Autobuses.
3. Pulsar el botón Ver autobús.

**Resultado esperado:** Se crea un solo autobús y el botón abre su detalle correcto. El registro conserva los datos capturados.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### FLO-02 · Rechazar identificación duplicada

**Módulo:** Autobuses · **Rol:** Administración o Logística · **Prioridad:** P1

**Antes:** QA-A ya existe.

1. Intentar registrar otra unidad con sus mismas placas.
2. Revisar el error y cancelar.
3. Confirmar que el registro original siga igual.

**Resultado esperado:** Se rechaza la duplicación; no se crea una segunda unidad ni se altera QA-A.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### FLO-03 · Cambiar estado con trazabilidad

**Módulo:** Autobuses · **Rol:** Mecánico · **Prioridad:** P0

**Antes:** Autobús QA-A activo.

1. Abrir QA-A y cambiar su estado operativo con un motivo.
2. Actualizar la página.
3. Consultar el historial y los indicadores de Inicio.

**Resultado esperado:** El estado y su motivo se conservan; los indicadores corresponden a los datos actuales. Cambiar el estado no autoriza al Mecánico a editar placas o dar de alta unidades.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### FLO-04 · Inactivar una unidad autorizada

**Módulo:** Autobuses · **Rol:** Administración o Logística y Operador · **Prioridad:** P1

**Antes:** QA-B está autorizada al Operador QA.

1. Inactivar QA-B.
2. Como Operador, volver a cargar Reportar falla.
3. Reactivar QA-B al terminar.

**Resultado esperado:** La unidad inactiva no se ofrece para nuevos reportes o mantenimientos; su historial sigue disponible para perfiles autorizados.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### FAL-01 · Crear reporte de unidad autorizada

**Módulo:** Fallas · **Rol:** Operador · **Prioridad:** P0

**Antes:** QA-A autorizada al Operador QA.

1. Abrir Reportar falla y elegir QA-A.
2. Escribir tipo Frenos y una descripción ficticia suficientemente detallada.
3. Guardar, volver a Mis reportes y pulsar Ver reporte.

**Resultado esperado:** Se guarda una sola falla Pendiente, por evaluar y con el operador/unidad correctos. El botón abre ese reporte.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### FAL-02 · Datos obligatorios y unidad no autorizada

**Módulo:** Fallas · **Rol:** Operador · **Prioridad:** P1

**Antes:** Formulario de reporte abierto.

1. Intentar guardar sin elegir autobús o sin descripción.
2. Revisar qué campo señala la pantalla.
3. Buscar una unidad que Administración no autorizó.

**Resultado esperado:** No se guarda un reporte incompleto. La unidad no autorizada no está disponible; no se confunde una validación con un fallo del servidor.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### FAL-03 · Privacidad entre operadores

**Módulo:** Fallas · **Rol:** Dos operadores QA · **Prioridad:** P0

**Antes:** Cada operador tiene un reporte propio y ventanas/perfiles separados.

1. Abrir como Operador B la dirección del reporte de A.
2. Intentar abrir también un enlace de una foto de ese reporte.
3. Volver a Mis reportes de B.

**Resultado esperado:** B no ve el reporte ni la foto de A; su lista sigue limitada a sus propios registros.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### FAL-04 · Evaluar y priorizar una falla

**Módulo:** Fallas · **Rol:** Mecánico · **Prioridad:** P0

**Antes:** FAL-01 creada y sin finalizar.

1. Abrir el reporte.
2. Elegir prioridad, registrar evaluación mecánica y motivo.
3. Guardar y actualizar la página.

**Resultado esperado:** Se conservan evaluación, prioridad y responsable. Administración y Logística pueden consultar esta información, pero no evaluarla como Mecánico.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### FOT-01 · Previsualizar, guardar y ampliar

**Módulo:** Fotografías · **Rol:** Operador o Mecánico · **Prioridad:** P0

**Antes:** Imagen PNG/JPEG de prueba menor a 5 MB, sin datos personales.

1. Seleccionar la imagen al reportar o en el detalle de la falla.
2. Comprobar la vista previa y guardar/subir.
3. Pulsar la miniatura, ampliar y cerrar el visor; descargar solo si se desea.

**Resultado esperado:** La foto se muestra antes de subirla y luego dentro del reporte, sin obligar a descargar. Cerrar el visor devuelve a la pantalla; la descarga opcional conserva la imagen.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### FOT-02 · Rechazar archivos no permitidos

**Módulo:** Fotografías · **Rol:** Operador o Mecánico · **Prioridad:** P1

**Antes:** Un PDF y una imagen de prueba que supere 5 MB.

1. Intentar seleccionar el PDF.
2. Intentar seleccionar la imagen demasiado grande.
3. Seleccionar finalmente una imagen válida.

**Resultado esperado:** Se informa que se permiten PNG/JPEG hasta 5 MB. Los archivos inválidos no se guardan; después puede seleccionarse uno válido.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### FOT-03 · Quitar selección y cancelar borrado

**Módulo:** Fotografías · **Rol:** Autor de la foto · **Prioridad:** P1

**Antes:** Una foto guardada y otra seleccionada sin guardar.

1. Pulsar Quitar foto seleccionada.
2. En la foto guardada pulsar Eliminar foto.
3. Elegir Cancelar y actualizar.

**Resultado esperado:** La selección pendiente se limpia sin subir; cancelar el borrado conserva la foto ya guardada.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### FOT-04 · Eliminar foto propia y verificar autoría

**Módulo:** Fotografías · **Rol:** Autor y otro usuario · **Prioridad:** P0

**Antes:** Foto de prueba guardada y su dirección anotada.

1. Confirmar Eliminar foto con el autor.
2. Actualizar e intentar abrir la dirección anterior.
3. Con otro usuario consultar una foto que no subió.

**Resultado esperado:** La foto eliminada desaparece y su enlace deja de funcionar; el historial registra la eliminación. Otro usuario no dispone del botón para borrar una foto ajena.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### ORD-01 · Agrupar y asignar fallas

**Módulo:** Órdenes correctivas · **Rol:** Administración o Logística · **Prioridad:** P0

**Antes:** Dos fallas QA evaluadas, pendientes, sin orden y del mismo autobús.

1. Crear orden desde las fallas o desde Órdenes de trabajo.
2. Seleccionar las dos fallas y guardar un título QA.
3. Asignar un mecánico activo con motivo y abrir Ver orden.

**Resultado esperado:** Una sola orden agrupa ambas fallas, tiene la unidad correcta y conserva la asignación. No se duplica al volver a consultar.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### ORD-02 · Evitar mezclas e incorporación duplicada

**Módulo:** Órdenes correctivas · **Rol:** Administración o Logística · **Prioridad:** P1

**Antes:** Hay fallas de dos unidades y una falla ya vinculada a una orden.

1. Intentar seleccionar fallas de unidades diferentes.
2. Intentar incorporar una falla ya vinculada o no evaluada.
3. Revisar la lista y las órdenes existentes.

**Resultado esperado:** La interfaz no ofrece combinaciones incompatibles o el servidor las rechaza; no queda una orden parcial ni una falla en dos órdenes.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### ORD-03 · Iniciar solo cuando corresponde

**Módulo:** Órdenes correctivas · **Rol:** Mecánico asignado y no asignado · **Prioridad:** P0

**Antes:** Orden QA abierta y asignada al Mecánico A.

1. Abrirla como Mecánico B.
2. Abrirla luego como Mecánico A e iniciar con diagnóstico/motivo.
3. Consultar las fallas vinculadas.

**Resultado esperado:** B no puede iniciarla. A la pasa a En proceso y todas sus fallas cambian juntas. En correctivos Administración y Logística coordinan, pero no finalizan.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### ORD-04 · Espera de refacciones

**Módulo:** Órdenes correctivas · **Rol:** Mecánico asignado · **Prioridad:** P1

**Antes:** Orden correctiva QA en proceso.

1. Registrar espera de refacciones con motivo.
2. Actualizar y consultar su estado.
3. Terminar la espera con motivo.

**Resultado esperado:** Se conserva En proceso y cambia el aviso de espera. No se cambia automáticamente el estado del autobús.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### ORD-05 · Finalizar y conservar cierre

**Módulo:** Órdenes correctivas · **Rol:** Mecánico asignado · **Prioridad:** P0

**Antes:** Orden en proceso. Si se comprobará inventario, ejecutar INV-03 e INV-04 antes del cierre.

1. Finalizar con trabajo realizado, observaciones y motivo.
2. Indicar si hubo mano de obra/refacciones y capturar los datos correspondientes.
3. Actualizar y revisar orden, fallas e historial.

**Resultado esperado:** Orden y fallas quedan finalizadas una sola vez. Se conservan responsable y trabajo; el cierre no descuenta piezas otra vez ni habilita automáticamente el autobús.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### ORD-06 · Consulta de Contabilidad

**Módulo:** Órdenes correctivas · **Rol:** Contabilidad · **Prioridad:** P0

**Antes:** Orden QA con entregas/devoluciones; preferentemente ejecutar INV-02 a INV-04.

1. Abrir Órdenes de trabajo, buscar la orden y pulsar Ver orden.
2. Consultar trabajo, entregas, devoluciones y costo neto.
3. Revisar que no haya acciones de modificación.

**Resultado esperado:** Contabilidad ve en qué unidad/orden se utilizaron las piezas y sus importes. No puede asignar, iniciar, finalizar ni registrar movimientos.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### INV-01 · Registrar refacción y reconocer su código

**Módulo:** Inventario · **Rol:** Administración, Logística o Mecánico · **Prioridad:** P0

**Antes:** Código único QA-FIL-[corrida].

1. Abrir Catálogo de refacciones y registrar una refacción ficticia.
2. Capturar código SKU sin espacios, descripción, unidad pieza y mínimo 2.
3. Guardar y buscarla en Existencias.

**Resultado esperado:** La refacción se guarda con su código único y saldo inicial cero. SKU es el código de catálogo; crear una refacción no agrega existencias.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### INV-02 · Entrada y costo del almacén

**Módulo:** Inventario · **Rol:** Logística · **Prioridad:** P0

**Antes:** Refacción de INV-01 con saldo cero; escenario de conciliación sin operaciones ajenas.

1. En Inventario elegir Registrar entrada.
2. Seleccionar la refacción; registrar 10 piezas a 100 MXN por pieza con motivo.
3. Actualizar Existencias y consultar movimientos.

**Resultado esperado:** Saldo 10; valor 1,000 MXN y costo promedio 100 MXN. Se registra una sola entrada. Otros roles sin permiso financiero no ven esos importes.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### INV-03 · Entregar a una orden abierta

**Módulo:** Inventario · **Rol:** Logística · **Prioridad:** P0

**Antes:** INV-02 aprobada y una orden QA abierta o en proceso. Ejecutar antes de ORD-05.

1. Elegir Entregar a orden.
2. Seleccionar la orden y entregar 2 piezas.
3. Consultar saldo y materiales de la orden.

**Resultado esperado:** Saldo 8 y valor 800 MXN; la orden recibe 2 piezas con costo total 200 MXN. El descuento ocurre al entregar.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### INV-04 · Devolver sobrante de una entrega

**Módulo:** Inventario · **Rol:** Logística · **Prioridad:** P0

**Antes:** Entrega de INV-03 identificada.

1. Elegir devolución de la entrega original.
2. Devolver 1 pieza con motivo.
3. Consultar saldo y costo neto de la orden.

**Resultado esperado:** Saldo 9 y valor 900 MXN. Costo neto de la orden: 100 MXN. La devolución usa el costo de la entrega; no inventa una compra.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### INV-05 · Impedir negativos y devoluciones excesivas

**Módulo:** Inventario · **Rol:** Logística · **Prioridad:** P0

**Antes:** Saldo 9; entrega original de 2 piezas con 1 ya devuelta.

1. Intentar entregar 10 piezas.
2. Intentar devolver 2 piezas adicionales de esa entrega.
3. Actualizar saldo y movimientos.

**Resultado esperado:** Ambas operaciones se rechazan; el saldo permanece 9 y la devolución total no excede lo entregado. No se permiten existencias negativas.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### INV-06 · Ficha con foto, condición y unidad

**Módulo:** Inventario · **Rol:** Administración, Logística o Mecánico · **Prioridad:** P1

**Antes:** Una refacción de catálogo y autobús QA activo.

1. Crear una ficha con foto, condición libre y situación Pendiente; dejar costo aproximado vacío.
2. Guardar, abrir y cambiarla a En uso eligiendo una unidad.
3. Revisar existencias antes y después.

**Resultado esperado:** La ficha conserva foto, condición y situación. En uso requiere una unidad válida. Una ficha individual no altera saldo ni valoración del almacén; costo aproximado no es costo contable.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### COM-01 · Compra recibida sin proveedor registrado

**Módulo:** Compras · **Rol:** Logística · **Prioridad:** P0

**Antes:** Refacción QA con saldo 9 y costo 100 después de INV-04/05.

1. Abrir Compras y Nueva compra.
2. Dejar proveedor y referencia opcionales vacíos; capturar 5 piezas a 100 MXN y motivo.
3. Elegir registrar compra e ingresar piezas; guardar y consultar compra/existencias.

**Resultado esperado:** La compra se registra sin exigir proveedor, obtiene referencia y queda recibida. Saldo final 14, valor 1,400 MXN y promedio 100 MXN.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### COM-02 · Pedido pendiente y recepción parcial

**Módulo:** Compras · **Rol:** Logística · **Prioridad:** P0

**Antes:** COM-01 aprobada; no hacer otras operaciones con esa refacción.

1. Crear un pedido de 2 piezas a 120 MXN, pendiente de recibir.
2. Confirmar que aún haya 14 piezas.
3. Recibir 1 pieza; revisar y luego recibir la otra.

**Resultado esperado:** El pedido no incrementa stock. Primera recepción: 15 piezas y valor 1,520 MXN; segunda: 16 piezas y valor 1,640 MXN. El promedio final es 102.50 MXN; se muestra progreso parcial/recibido.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### COM-03 · Evitar recepción duplicada o excesiva

**Módulo:** Compras · **Rol:** Logística · **Prioridad:** P0

**Antes:** Compra QA recibida totalmente en COM-02.

1. Intentar recibir más que lo pendiente.
2. Actualizar la compra y revisar las acciones disponibles.
3. Consultar movimientos y saldo de la refacción.

**Resultado esperado:** No admite cantidades adicionales ni una segunda recepción del mismo saldo; permanece 16 si no hubo otras operaciones.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### COM-04 · Borrador y aprobación propia

**Módulo:** Compras · **Rol:** Logística · **Prioridad:** P1

**Antes:** Usar otra referencia QA y una nueva compra, sin alterar el escenario numérico principal.

1. Crear un borrador con una partida válida.
2. Revisar que no aumenten las existencias.
3. Aprobar la compra con el mismo usuario y revisar antes de recibir.

**Resultado esperado:** Logística puede aprobar sus propias compras. Preparar o aprobar no ingresa piezas hasta registrar recepción.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### MAN-01 · Guardar y asignar en un paso

**Módulo:** Mantenimiento · **Rol:** Administración · **Prioridad:** P0

**Antes:** QA-A activo y un mecánico activo.

1. Abrir Nuevo mantenimiento y seleccionar QA-A.
2. Capturar nombre único, fecha programada y dos tareas; mantener control Por fecha.
3. Seleccionar mecánico y Guardar mantenimiento.

**Resultado esperado:** Se guardan juntos plan, tareas, orden y asignación. No exige un kilometraje ficticio del último servicio. Queda Pendiente y todavía no cuenta como realizado.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### MAN-02 · Avances que se conservan

**Módulo:** Mantenimiento · **Rol:** Logística · **Prioridad:** P0

**Antes:** MAN-01 guardado.

1. Abrir su seguimiento e Iniciar mantenimiento.
2. Marcar solo una tarea y Guardar avances.
3. Salir, regresar y actualizar.

**Resultado esperado:** El mantenimiento queda En proceso; conserva solo la tarea guardada y muestra el número de tareas completadas. El mensaje confirma que el avance se guardó.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### MAN-03 · No cerrar con tareas pendientes

**Módulo:** Mantenimiento · **Rol:** Mecánico · **Prioridad:** P0

**Antes:** MAN-02 con una tarea pendiente.

1. Intentar Finalizar mantenimiento.
2. Capturar un trabajo realizado válido y confirmar.
3. Volver al seguimiento y al historial de servicios.

**Resultado esperado:** El cierre se rechaza por checklist incompleto; no se crea un servicio realizado ni se modifica la próxima fecha por un cierre fallido.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### MAN-04 · Finalizar, calcular mes y editar próxima fecha

**Módulo:** Mantenimiento · **Rol:** Mecánico · **Prioridad:** P0

**Antes:** Todas las tareas completadas y guardadas.

1. Finalizar; indicar fecha real de hoy o anterior y describir el trabajo.
2. Revisar la fecha propuesta un mes después; cambiarla a otra posterior si se desea.
3. Confirmar y consultar Historial de servicios, filtrando por el mes realizado.

**Resultado esperado:** Queda un servicio finalizado con fecha real, lectura y responsable. La próxima fecha coincide con lo confirmado. El historial lo muestra en el mes realizado, no como un servicio pendiente.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### MAN-05 · Los tres perfiles gestionan preventivos

**Módulo:** Mantenimiento · **Rol:** Administración, Logística y Mecánico · **Prioridad:** P0

**Antes:** Crear un mantenimiento nuevo con nombre distinto para cada perfil.

1. Repetir creación, inicio y guardado de todas las tareas con cada rol.
2. Finalizar cada servicio con ese mismo rol.
3. Revisar quién figura como responsable en orden e historial.

**Resultado esperado:** Los tres perfiles pueden completar el proceso preventivo aunque el cierre no lo haga el mecánico asignado. El responsable real queda registrado. Esto no amplía los permisos de órdenes correctivas.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### MAN-06 · Avisos de fecha y próximos días

**Módulo:** Mantenimiento · **Rol:** Uno de los tres perfiles gestores · **Prioridad:** P1

**Antes:** Tres planes QA con fecha de hoy, dentro de 7 días y después de 7 días.

1. Actualizar Inicio y Mantenimiento.
2. Revisar Ya les toca y Próximos 7 días.
3. Pulsar Ya les toca y abrir el registro correspondiente.

**Resultado esperado:** Hoy cuenta como vencimiento alcanzado; dentro de siete días aparece como próximo. Un plan posterior a siete días no incrementa ese contador. Los avisos son internos, sin correo ni notificación externa.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### MAN-07 · Fechas inválidas y fin de mes

**Módulo:** Mantenimiento · **Rol:** Uno de los tres perfiles gestores · **Prioridad:** P1

**Antes:** Servicio QA con todas sus tareas guardadas y sin finalizar.

1. Intentar cerrar con fecha realizada futura.
2. Intentar una próxima fecha igual o anterior a la realizada.
3. En otro caso independiente, elegir 31/01/2024 como fecha realizada y revisar la propuesta sin guardar si afectaría la secuencia.

**Resultado esperado:** Las fechas incompatibles se rechazan. Para 31/01/2024 se propone 29/02/2024; para 31/01/2026, 28/02/2026. No sobrescribe un último servicio más reciente. Cancelar no registra un cierre.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### MAN-08 · Tareas futuras y plan por kilómetros

**Módulo:** Mantenimiento · **Rol:** Uno de los tres perfiles gestores · **Prioridad:** P1

**Antes:** Un plan con ejecución abierta; para kilómetros conocer una lectura real anterior.

1. Editar las tareas futuras del plan y consultar la ejecución ya abierta.
2. Comprobar que sus tareas originales no cambien.
3. Crear aparte un plan Por fecha y kilometraje, con último servicio 900 e intervalo 100 para QA-A a 1,000 km.

**Resultado esperado:** La ejecución conserva sus tareas históricas; futuros servicios usan la plantilla editada. El ejemplo por km ya requiere atención al alcanzar 1,000 km. Los planes antiguos por km siguen siendo consultables.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### MAN-09 · Reintento sin datos parciales

**Módulo:** Mantenimiento · **Rol:** Uno de los tres perfiles gestores · **Prioridad:** P1

**Antes:** Formulario nuevo completo; realizar en demo y conservar su nombre único.

1. Desconectar temporalmente la red del navegador desde sus herramientas o detener solo la API de prueba con ayuda técnica.
2. Intentar guardar y observar el mensaje; restablecer la conexión/servicio.
3. Revisar si el registro ya existe antes de repetir; reintentar si no se guardó.

**Resultado esperado:** La pantalla informa el fallo y permite corregir/reintentar. No quedan plan u orden a medias. Ante respuesta perdida se consulta primero para evitar duplicados; nunca se debe suponer que la operación no llegó al servidor.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### REP-01 · Costos y existencias conciliados

**Módulo:** Reportes · **Rol:** Logística y Contabilidad · **Prioridad:** P0

**Antes:** INV-02 a COM-03 aprobados, sin otras operaciones en esa refacción.

1. Abrir reportes de inventario y costos por autobús.
2. Filtrar la refacción/unidad QA cuando el reporte lo permita o identificarla en los resultados.
3. Comparar con los movimientos del escenario.

**Resultado esperado:** Existencia 16 y valor 1,640 MXN; promedio 102.50 MXN. La orden de INV-03/04 conserva costo neto 100 MXN. Compras por 740 MXN no se suman además como consumo del autobús.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### REP-02 · Exportar y contrastar el CSV

**Módulo:** Reportes · **Rol:** Rol con reporte permitido · **Prioridad:** P1

**Antes:** Reporte filtrado con registros QA.

1. Aplicar búsqueda/filtros y anotar cantidad/totales.
2. Exportar CSV y abrirlo en Excel importando UTF-8 y separador coma si hace falta.
3. Comparar contenido, acentos y totales; probar también un filtro sin coincidencias.

**Resultado esperado:** La exportación respeta alcance y filtros e incluye todas las coincidencias, no solo la página visible. Un resultado vacío conserva encabezados. Un valor con decimales no debe confundirse con un importe en otra moneda.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### REP-03 · Restricciones financieras

**Módulo:** Reportes · **Rol:** Administración, Mecánico y Operador · **Prioridad:** P0

**Antes:** Cuentas de esos roles y rutas de reportes financieros conocidas.

1. Revisar su catálogo de reportes.
2. Intentar abrir compras, valoración y costos por dirección directa.
3. Comparar con una sesión de Contabilidad.

**Resultado esperado:** Los perfiles sin permiso financiero no consultan ni exportan esos importes; Contabilidad y Logística sí. Operador conserva solo reportes propios permitidos.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### UX-01 · Reconocer botones sin ayuda

**Módulo:** Usabilidad · **Rol:** Usuario representativo y tester · **Prioridad:** P1

**Antes:** Lista de Fallas con al menos dos registros; no explicar primero dónde pulsar.

1. Pedir al usuario: abre el reporte de la unidad indicada.
2. Observar si identifica Ver reporte y abre el registro correcto.
3. Repetir con Ver orden, Ver autobús y un servicio del historial.

**Resultado esperado:** Los botones tienen fondo, borde, tamaño y texto legibles. Registrar tiempo, ayuda solicitada y confusiones reales; no marcar aprobado solo por la opinión del tester.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### UX-02 · Teclado y tamaño de ventana

**Módulo:** Usabilidad · **Rol:** Cualquier rol · **Prioridad:** P1

**Antes:** PC y ventana estrecha o simulación móvil; no requiere publicar a la red.

1. Recorrer con Tab y activar los botones con Enter.
2. Abrir/cerrar un diálogo con sus controles y revisar el foco visible.
3. Probar zoom 125–150 % y ancho cercano a 390 px.

**Resultado esperado:** Se puede llegar a los controles y reconocer el foco; texto y botones siguen utilizables. Las tablas anchas pueden desplazarse dentro de su contenedor, sin ocultar el acceso principal al registro.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### CON-01 · Evitar sobreescritura entre sesiones

**Módulo:** Concurrencia · **Rol:** Dos sesiones gestoras · **Prioridad:** P1

**Antes:** Mismo plan/registro versionado abierto en dos ventanas antes de editar.

1. Guardar un cambio válido en la primera sesión.
2. Intentar guardar desde la segunda sin actualizar.
3. Recargar en la segunda y comprobar la información vigente.

**Resultado esperado:** La edición obsoleta se rechaza o pide recargar; el primer cambio no se pierde. No debe usarse la misma sesión/cookie para simular dos usuarios diferentes.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### REC-01 · Arranque después de reiniciar

**Módulo:** Recuperación · **Rol:** Tester con acceso local · **Prioridad:** P0

**Antes:** Trabajo guardado; Docker Desktop instalado y equipo con virtualización funcional.

1. Cerrar con Ctrl+C y reiniciar Windows cuando no haya trabajo pendiente.
2. Abrir Docker y esperar a que el motor esté listo; iniciar la demo con npm.cmd run demo.
3. Entrar a http://localhost:4202 y consultar un registro QA anterior.

**Resultado esperado:** API, MySQL e interfaz funcionan y los datos guardados permanecen. Si solo falla la infraestructura, registrar bloqueo del caso en vez de atribuir automáticamente un error funcional.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### REC-02 · Guardar no debe duplicar por doble clic

**Módulo:** Recuperación · **Rol:** Tester con rol habilitado · **Prioridad:** P1

**Antes:** Formulario nuevo válido con nombre/código únicos.

1. Pulsar Guardar dos veces rápidamente.
2. Esperar a que termine y actualizar el listado.
3. Buscar exactamente el identificador usado.

**Resultado esperado:** No hay dos registros/operaciones equivalentes. El control de guardado evita repeticiones o el servidor rechaza la duplicación; revisar el resultado antes de repetir.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

### AUD-01 · Trazabilidad del recorrido

**Módulo:** Auditoría · **Rol:** Administración · **Prioridad:** P1

**Antes:** Casos de cambios, fotos, órdenes y mantenimiento ejecutados.

1. Consultar Auditoría o los historiales de cada registro.
2. Identificar actor, fecha de captura, motivo y cambio.
3. Comparar con las evidencias de la corrida.

**Resultado esperado:** El responsable y los cambios coinciden con lo ejecutado; no aparecen contraseñas ni tokens. La fecha de captura puede mostrarse en UTC y diferir del día local realizado del mantenimiento.

**Evidencia:** Captura del resultado y referencia del registro; sin contraseñas.

## 8. Registrar y clasificar errores

Título recomendado: [módulo] + acción + resultado observado. Ejemplo ilustrativo, no defecto confirmado: “[Mantenimiento] Guardar con datos válidos muestra error y no crea el servicio”.

Campos mínimos: ID del defecto, caso asociado, versión, URL/ambiente, rol, fecha/hora y zona horaria, precondiciones, pasos exactos, resultado esperado, resultado real, frecuencia, severidad, prioridad y evidencia.

Si aparece un error con requestId, copiar solo ese identificador y el mensaje. Una captura de consola/red puede incluir secretos: revisar y ocultar cookies, Authorization, tokens, contraseñas y cuerpos de acceso antes de compartir.

S1 Crítico: pérdida/corrupción de datos, acceso indebido de otro perfil, stock negativo o movimientos duplicados. S2 Alto: flujo esencial bloqueado con datos válidos, sin alternativa razonable. S3 Medio: función parcial o mensaje incorrecto con alternativa. S4 Bajo: detalle visual que no impide trabajar.

La severidad describe el impacto; la prioridad indica el orden de corrección (P0 inmediata, P1 alta, P2 media, P3 baja). Que algo sea visual no lo vuelve leve si impide a los empleados encontrar cómo continuar.

Estado del defecto: Abierto → En revisión → Corregido pendiente de prueba → Cerrado. Si no se resolvió, Reabierto. Duplicado o No reproducible requieren referencia y explicación.

Un error interno 500 al guardar datos válidos debe investigarse; un rechazo por campos faltantes, stock insuficiente o rol restringido puede ser la validación esperada. Si no se puede saber, registrar el caso como Bloqueado y adjuntar el mensaje, sin inventar una causa.

## 9. Pruebas técnicas opcionales

Esta sección es para quien tenga acceso técnico. No es necesario ejecutarla para llenar la prueba manual. El entorno automático usa tallerbus_test y regenera registros: no apuntarlo a tallerbus ni a tallerbus_demo.

Con dependencias, Docker, .local/test.env y cliente generado preparados por el responsable técnico, ejecutar desde tallerbus, de forma secuencial:

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
npm.cmd run test:unit
npm.cmd run test:integration
npm.cmd run test:e2e
```

No ejecutar integración, navegador y carga al mismo tiempo: comparten tallerbus_test. Guardar el resumen final de cada comando y su código de salida. npm.cmd run check agrupa las comprobaciones anteriores; no demuestra por sí solo que los empleados entiendan las pantallas.

Playwright necesita Chromium. En Windows el responsable configura CHROMIUM_PATH con la ruta del navegador compatible instalado; el proyecto tiene un valor predeterminado para Linux. Si falta navegador o .local/test.env, registrar bloqueo técnico; no modificar credenciales al azar.

Para repetir un módulo concreto: npx.cmd playwright test tests/e2e/maintenance.spec.mjs o tests/e2e/workflow.spec.mjs. Los archivos contienen recorridos seriales que dependen de su preparación: ejecutar el archivo completo, no un caso intermedio aislado.

El objetivo inicial es hasta 50 autobuses y 10 usuarios simultáneos. No presentar ese número como rendimiento medido. Cualquier prueba de carga debe coordinarse sobre la base aislada y registrar equipo, volumen, concurrencia, tiempos y errores.

Una prueba automatizada aprobada no sustituye la comprobación manual de legibilidad, uso con teclado, botones reconocibles o experiencia de personas mayores.

## 10. Qué revisar ante un bloqueo

No abre la página: comprobar que se inició la demo, que su terminal siga abierta y que la dirección sea localhost:4202. localhost:4200 pertenece al entorno habitual; localhost:4201, al automático.

Error de conexión, proxy o servidor interno: confirmar que Docker tenga el motor activo; no basta con que docker --version muestre una versión. Revisar la terminal del servidor y anotar hora/requestId. No borrar datos para intentar corregirlo.

Solicitud no autorizada: comprobar el rol y la sesión. Cerrar sesión e ingresar de nuevo si se cambió rol/activación. Comparar con la matriz antes de registrar un fallo.

No aparece autobús, refacción u orden: limpiar búsqueda/filtros, revisar páginas y verificar si está activa/autorizada o cerrada. En inventario la entrega requiere una orden abierta o en proceso.

No guarda mantenimiento: verificar autobús activo, nombre, fecha, tareas válidas y mecánico seleccionado. Para finalizar, iniciar primero, guardar todas las tareas y revisar la lectura actual de flota. Las próximas fechas deben ser posteriores a la fecha realizada.

Cambió la versión del registro: volver a cargar y revisar el dato guardado por la otra sesión. La protección de concurrencia evita sobrescrituras y no es un error interno.

Si un paso queda bloqueado por infraestructura, registrar Bloqueado con la causa observada y continuar solo con casos independientes. Restablecer la conexión antes de evaluar datos guardados.

## 11. Criterios de cierre y entrega

Propuesta de aceptación: todos los casos P0 aplicables aprobados, sin defectos S1/S2 abiertos, conciliación de inventario/costos comprobada, permisos por rol correctos y recorridos correctivo/preventivo completos. Los defectos menores pendientes deben quedar documentados y aceptados por el responsable.

Completar la hoja Resumen: total, aprobados, fallidos, bloqueados, no ejecutados y no aplicables. Un caso bloqueado no equivale a aprobado. Registrar siempre versión y fecha de la repetición.

Entregar al supervisor: manual utilizado, Excel de resultados, defectos abiertos/cerrados y carpeta de evidencias con IDs. No incluir .local, cuentas, contraseñas, base de datos ni fotos personales.

Resumen sugerido: “Se probó la versión [commit] en [ambiente/equipo]. Se ejecutaron [n] de [total] casos aplicables: [n] aprobados, [n] fallidos y [n] bloqueados. Quedan [n] defectos críticos/altos. Se recomienda [aceptar/no aceptar/repetir] por [motivo y alcance]”.

Firma o visto bueno: tester, fecha; responsable de revisión, fecha. La autorización final corresponde al responsable del proyecto y debe basarse en la evidencia, no únicamente en un mensaje de éxito.

## 12. Glosario y archivos incluidos

Tester: persona que comprueba resultados. Caso de prueba: pasos y resultado esperado. Evidencia: captura, archivo o referencia que demuestra lo observado. Regresión: repetir pruebas para comprobar que un cambio no rompió funciones previas.

Orden correctiva: trabajo asociado a fallas evaluadas. Preventivo: servicio por fecha y/o kilometraje con tareas y próxima programación. Checklist: lista de tareas marcables. SKU: código único del catálogo de refacciones. Ficha: seguimiento físico individual, independiente del saldo.

Stock/existencia: cantidad disponible. Costo promedio ponderado: valor total dividido entre cantidad, calculado por el sistema. Recepción: piezas que realmente ingresan por una compra. Entrega: piezas descontadas al asignarlas a una orden. Devolución: sobrante que regresa desde una entrega identificada.

Versión de registro: número que protege ediciones concurrentes. Commit: identificador de la versión del código. UTC: zona usada en fechas de captura/historial; los días de mantenimiento se manejan como fechas de calendario de la empresa.

Archivos: Manual_tester_TallerBus.docx (editable), Manual_tester_TallerBus.pdf (lectura), Plan_pruebas_TallerBus.xlsx (ejecución y defectos), Paquete_tester_TallerBus.zip (los tres). Fuente del manual: docs/manual-tester.md; catálogo: docs/qa/casos-prueba.json.
