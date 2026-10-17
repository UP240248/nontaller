# Auditoría del repositorio anterior

## Evidencia disponible

Inspección del 17 de octubre de 2026: `/workspace/nontaller`, remoto `https://github.com/UP240248/nontaller.git`. `git status` informa rama local `work`, sin commits y sin archivos. `git ls-files` no enumera archivos; `git ls-remote --symref origin` responde con código 0 sin referencias; la consulta específica de `main` termina con código 2 (sin coincidencia). No hay código en los directorios auxiliares inspeccionados ni instrucciones AGENTS.md. El usuario identificó el anterior como `https://github.com/UP240248/taller-autobuses.git`. No hay bocetos accesibles.

| Elemento solicitado | Hallazgo | Verificación posible |
|---|---|---|
| Frontend, servicios Angular, estilos | Ausentes | Ninguna prueba funcional |
| Backend, autenticación, permisos | Ausentes | Ninguna prueba funcional |
| Prisma, migraciones, seeds | Ausentes | Sin base ni esquema verificables |
| Manifiestos, lockfiles, versiones | Ausentes | Compatibilidad no evaluable |
| Pruebas, CI y documentación | Ausentes | Sin suites ejecutables |
| Datos productivos | No disponibles | No se solicita ni autoriza migración |

## Riesgos y límites

No hay evidencia para afirmar qué funciona, qué deuda técnica existe o qué dependencias son vulnerables. No se ejecutó un análisis de vulnerabilidades porque no existe un inventario de dependencias. Tampoco se conocen los contratos reales, nomenclaturas de migraciones o diseños aprobados. El documento de requisitos es la única referencia funcional disponible.

La ausencia del anterior bloquea la auditoría de reutilización, no la propuesta arquitectónica. Se recibió su URL; falta acceso efectivo o una copia de sus archivos. No se creó un worktree ni se alteró código previo.

## Revisión cuando se aporte

Inventariar estructura y versiones; revisar secretos sin divulgarlos; instalar con lockfile en entorno aislado; ejecutar las suites existentes y registrar resultados; probar permisos, finalización, concurrencia y trazabilidad; contrastar schema con migraciones; revisar licencias y advisories oficiales de las dependencias identificadas. Actualizar esta auditoría y la matriz antes de copiar piezas. Sin acceso, todos esos resultados permanecen **no evaluados**.

## Acceso al anterior aportado

Se intentó `git clone --depth 1 https://github.com/UP240248/taller-autobuses.git /tmp/tallerbus-anterior-auditoria` y posteriormente la comprobación de solo lectura `git ls-remote --symref https://github.com/UP240248/taller-autobuses.git HEAD`. Ambas operaciones terminaron con código 128, HTTP 403 y mensaje remoto «Write access to repository not granted». Aunque el mensaje menciona escritura, las operaciones solicitadas eran de lectura. No se pidió un token ni se extrajo autenticación de la plataforma.

Esto demuestra acceso denegado con la autenticación disponible; no demuestra que el repositorio esté vacío o no exista. No se pudo inspeccionar su estructura, rama, versiones ni pruebas. Habilitar acceso al repositorio en la conexión/configuración del entorno, o adjuntar una copia, desbloquea la auditoría. No es un rechazo de aprobación automática de comandos.

Herramientas observadas en la máquina: Node v24.19.0, npm 11.9.0 y ejecutable Docker presente; cliente MySQL no encontrado en PATH. No se verificó daemon Docker ni compatibilidad del stack; estos hallazgos no equivalen a entorno de aplicación listo.

## Autorización posterior

El 17 de octubre de 2026 el usuario autorizó continuar desde cero. Aportó `taller-autobuses-main.zip`, cuya descarga falló porque excede el límite de transferencia de 32 MiB de la herramienta. No se leyó ni extrajo su contenido. La auditoría de código sigue no realizada, pero deja de ser requisito bloqueante para el desarrollo nuevo por autorización del usuario.
