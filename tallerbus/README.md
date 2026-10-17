# TallerBus · Terrabus

Sistema interno de la flota propia y el taller de Terrabus. Implementación nueva autorizada por el usuario, independiente del proyecto anterior.

## Fases 1–3: fundamentos, flota y atención de fallas

Angular standalone + NestJS modular + Prisma + MySQL. Incluye acceso real, perfil, sesiones revocables y gestión de usuarios/auditoría exclusiva de Administración. Administración y Logística gestionan autobuses; ambos y Mecánico consultan flota/historial y cambian estado operativo. Operador reporta fallas y consulta únicamente sus reportes; Contabilidad conserva solo perfil propio. Incluye dashboard con indicadores de MySQL, filtros, paginación y edición con control de versión. Incluye reporte/evaluación de fallas, fotos privadas, órdenes agrupadas, asignación, espera de piezas y finalización por mecánico asignado. Inventario, compras y valoración económica siguen pendientes.

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

El check ejecuta lint, TypeScript, builds, unitarias, integración MySQL y E2E reales. Las pruebas usan exclusivamente `tallerbus_test` local y eliminan sus fixtures; no ejecutarlas en paralelo ni apuntarlas a otra base. No modifican datos de desarrollo. Consulte los resultados de [Fase 1](docs/validacion-fase-1.md), [Fase 2](docs/validacion-fase-2.md) y [Fase 3](docs/validacion-fase-3.md).

## Documentación

- [Desarrollo y comandos](docs/manual-desarrollo.md) · [Windows y operación local](docs/despliegue-local.md)
- [Manual de usuario](docs/manual-usuario.md) · [API](docs/api.md) · [Permisos](docs/permisos.md)
- [Arquitectura](docs/arquitectura.md) · [Modelo de datos](docs/modelo-datos.md)
- [Decisiones pendientes](docs/decisiones-pendientes.md) · [Fases](docs/plan-fases.md)
- [Auditoría anterior](docs/auditoria-repositorio-anterior.md) · [Reutilización](docs/plan-migracion.md)
- [Respaldos](docs/respaldos.md) · [Cambios](CHANGELOG.md)

El anterior `UP240248/taller-autobuses` no se pudo leer (HTTP 403); el ZIP aportado excede el límite de transferencia de 32 MiB. No se reutilizó código no inspeccionado, no se migraron datos y no se hicieron cambios en el anterior.

## Estado Git

Las Fases 1 y 2 fueron guardadas por petición del usuario en el commit local `da104eb` de la rama `work`. No se hizo push. La Fase 3 se guarda en un commit separado sobre ese punto. La rama de entrega en GitHub es `tallerbus/fases-1-3`; los informes de validación conservan el estado de cada entrega antes de su publicación posterior.
