# TallerBus · Terrabus

Sistema interno de la flota propia y el taller de Terrabus. Implementación nueva autorizada por el usuario, independiente del proyecto anterior.

## Fases 1–6 y consolidación local de Fase 7

Angular standalone + NestJS modular + Prisma + MySQL. Incluye acceso real, perfil, sesiones revocables y gestión de usuarios/auditoría exclusiva de Administración. Administración y Logística gestionan autobuses; ambos y Mecánico consultan flota/historial y cambian estado operativo. Operador reporta fallas y consulta únicamente sus reportes; Contabilidad consulta y exporta reportes financieros autorizados, sin operaciones de escritura. Incluye dashboard con indicadores de MySQL, filtros, paginación y edición con control de versión. Incluye reporte/evaluación de fallas, fotos privadas, órdenes agrupadas, asignación, espera de piezas y finalización por mecánico asignado. Logística gestiona refacciones/proveedores, entradas, entregas a órdenes, devoluciones, ajustes y compras con aprobación propia y recepción parcial. Un almacén, descuento al entregar sin negativos y costo promedio ponderado en MXN; los demás roles operativos autorizados ven existencias sin importes. Incluye mantenimiento preventivo por kilometraje: Logística configura planes e intervalos por unidad y asigna mecánicos; checklist histórico, órdenes y cierre sin doble consumo. No se precargan servicios o intervalos supuestos. Reportes de flota, fallas, órdenes, preventivos, compras, valoración y costos netos por autobús, con filtros y CSV seguro. Importes solo para Logística/Contabilidad; reportes propios de Operador y órdenes asignadas de Mecánico.

## Inicio local

Requisitos: Node 24.19.0, npm 11.9.0, Docker con contenedores Linux para MySQL; para E2E, Chromium. Desde `tallerbus/`:

```sh
npm ci
npm run setup
npm run bootstrap
npm run dev
```

`bootstrap` solicita datos y contraseña oculta para crear el primer administrador; no admite ejecución no interactiva ni reemplaza administradores existentes. Como alternativa **solo de desarrollo**, `npm run seed:dev` crea cinco cuentas ficticias con claves aleatorias en `.local/dev-accounts.json`, privado e ignorado por Git. No ejecutar ambos mecanismos en una base ya poblada.

Configuración privada generada en `.local/`; `.env.example` solo documenta variables, no se carga automáticamente. No publicar ni compartir `.local/`. Los procesos deben reiniciarse en cada sesión; el volumen Docker de MySQL requiere respaldo independiente.

```sh
npm run check
```

El check ejecuta lint, TypeScript, builds, unitarias, integración MySQL y E2E reales. Las pruebas usan exclusivamente `tallerbus_test` local y eliminan sus fixtures; no ejecutarlas en paralelo ni apuntarlas a otra base. No modifican datos de desarrollo. Consulte los resultados de [Fase 1](docs/validacion-fase-1.md), [Fase 2](docs/validacion-fase-2.md), [Fase 3](docs/validacion-fase-3.md), [Fase 4](docs/validacion-fase-4.md), [Fase 5](docs/validacion-fase-5.md), [Fase 6](docs/validacion-fase-6.md) y [revisión local de Fase 7](docs/validacion-fase-7.md).

## Documentación

- [Desarrollo y comandos](docs/manual-desarrollo.md) · [Windows y operación local](docs/despliegue-local.md)
- [Manual de usuario](docs/manual-usuario.md) · [API](docs/api.md) · [Permisos](docs/permisos.md)
- [Arquitectura](docs/arquitectura.md) · [Modelo de datos](docs/modelo-datos.md)
- [Decisiones pendientes](docs/decisiones-pendientes.md) · [Fases](docs/plan-fases.md)
- [Auditoría anterior](docs/auditoria-repositorio-anterior.md) · [Reutilización](docs/plan-migracion.md)
- [Operación](docs/operacion.md) · [Respaldos](docs/respaldos.md) · [Cambios](CHANGELOG.md)

El anterior `UP240248/taller-autobuses` no se pudo leer (HTTP 403); el ZIP aportado excede el límite de transferencia de 32 MiB. No se reutilizó código no inspeccionado, no se migraron datos y no se hicieron cambios en el anterior.

## Estado Git

La entrega incluye las Fases 1–6 y mejoras locales de consolidación de Fase 7. Fundamentos/flota/fallas se integraron mediante `639bcb5`; inventario/compras están en `211fc10` y preventivo por kilometraje en `b3c50c1`. Las ramas `tallerbus/fase-4` y `tallerbus/fase-5` conservan los puntos de entrega. Los informes de validación documentan los resultados y el estado local al finalizar cada fase, antes de su integración posterior.

Las Fases 1–5 se integraron en main mediante `c507a16`; la rama de entrega de Fase 6 es `tallerbus/fase-6`. La validación completa de Fase 6 pasó 127 pruebas. La rama de consolidación `tallerbus/fase-7` registra 146 pruebas aprobadas y el ensayo de recuperación local. Consulta las referencias remotas para confirmar la publicación de cada versión. Publicar código en GitHub no equivale a desplegar la aplicación ni a publicar el entorno cloud.

## Uso personal local

El alcance actual confirmado es uso personal en el equipo del usuario, sin publicar en la red de la empresa. Sigue [la guía de instalación, arranque y respaldo](docs/uso-local-personal.md). Con la aplicación iniciada, `npm run status:local` comprueba API/MySQL, interfaz y proxy sin modificar datos. No necesitas dominio para ese uso.

## Consolidación y recuperación local

`npm run backup:local -- --offline` crea copia privada de MySQL/fotos con la API detenida; `npm run backup:verify -- RUTA` demuestra restauración en base/carpeta temporal, concilia filas/relaciones/costos y revoca sesiones solo en copia. No sustituye datos existentes ni implementa respaldos externos automáticos. Ver [procedimiento y límites](docs/respaldos.md).

Un eventual despliegue empresarial/productivo requiere validar HTTPS/proxy/BD remota, almacenamiento externo, RPO/RTO y aceptación con usuarios en el servidor definitivo. Está fuera del alcance local personal confirmado. La Fase 7 local no acredita esos puntos ni certificación completa de accesibilidad/rendimiento.

## Datos para presentar la aplicación

`npm run demo:setup` prepara una base **tallerbus_demo** separada y `npm run demo` inicia la presentación en localhost:4202. Incluye autobuses, fallas, órdenes, compras, inventario y preventivos ficticios con cuentas de los cinco roles; conserva los datos personales. Ver [demostración y credenciales privadas](docs/demostracion.md).

## Acceso con nombre de usuario

El login y el alta de cuentas usan **usuario de acceso**, **nombre del empleado** y contraseña de **mínimo 8 caracteres**, sin correo. Administración ve usuario/nombre/rol/estado; las contraseñas se guardan protegidas y no se muestran. Para actualizar sin perder cuentas, sigue [migración a usuario](docs/acceso-por-usuario.md). Después de setup, `npm run users:local` muestra los identificadores migrados sin claves.

## Inicio después de reiniciar el equipo

`npm run dev` y `npm run demo` ahora preparan MySQL, verifican SQL/esquema con la cuenta de aplicación y solo después inician API/interfaz. Docker Desktop debe estar abierto y listo. No crean cuentas ni reemplazan credenciales. Consulta [actualización y diagnóstico de arranque](docs/arranque-tras-reinicio.md).
