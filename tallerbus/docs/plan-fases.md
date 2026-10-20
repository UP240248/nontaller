# Plan de fases y criterios de aceptación

Cada entrega sigue una vertical: esquema/migración → servicio/DTO/política → API → Angular → pruebas → documentación. Cambios acotados, sin migraciones productivas ni borrados. La Fase 0 es documental; las fases de implementación requieren demostración de extremo a extremo.

| Fase | Alcance y archivos previstos | Criterios de aceptación |
|---|---|---|
| 0 Descubrimiento | README y docs: auditoría, arquitectura, modelo, permisos y plan | Evidencia de inventario, propuestas diferenciadas de hechos, pendientes y alcance de Fase 1 explícitos. Auditoría anterior pendiente de acceso |
| 1 Fundamentos | frontend/core/shared/layout, backend/auth/users/audit, Prisma inicial, scripts y configuración ejemplo | Instalación reproducible con versiones fijadas; MySQL aislado y migraciones; login real, perfil, logout y revocación; navegación por rol; hash seguro y usuario local sin credenciales versionadas; validación, logs, OpenAPI; lint/typecheck/build y tests unitarios, integración de sesiones/permisos y E2E login/logout pasan |
| 2 Flota | fleet/autobuses, dashboard e historial | Alta, consulta, edición y activación real; número económico único y kilometraje válido; filtro/orden/paginación servidor; auditoría y conflicto de versión; KPIs consultan BD; E2E del ciclo de unidad y denegación por rol |
| 3 Fallas/órdenes | incidents, work-orders, evidencia y asignaciones | Reporte hasta finalización con campos obligatorios; estados preservados, evidencia protegida, trazabilidad y concurrencia; pruebas de cierre inválido, acceso ajeno y habilitación manual con otras fallas abiertas según la decisión aprobada |
| 4 Inventario/compras | inventory, suppliers, purchasing, costos de consumo | Reglas aprobadas previamente; movimientos y recepción parcial atómicos; no negativos; idempotencia y concurrencia probadas; costo histórico sin doble contabilización; E2E recepción/consumo/devolución |
| 5 Preventivo | maintenance y vínculos a órdenes | Intervalos configurables en kilómetros, checklist histórico y vencimiento verificable con lecturas controladas; ejecución no duplica consumos; E2E plan→ejecución |
| 6 Vistas/reportes | operator/logistics/accounting, reports/export | Alcances por rol; filtros combinados y CSV seguro; totales reconciliados con orígenes y costos exactos; check-in/out solo si aprobado; E2E y acceso a exportación |
| 7 Consolidación | Auditoría transversal, documentación y operación | E2E críticos completos, revisión manual y automatizada WCAG 2.2 AA, pruebas de rendimiento con carga acordada, hardening, restauración demostrada y manuales probados |

## Protocolo de validación

En cada fase de código ejecutar lint, typecheck, build, unitarias relevantes, integración backend con base aislada y autorización por rol, más recorridos E2E de lo implementado. Registrar comandos exactos, versiones, cantidades y resultados: pasados, fallidos, omitidos y no ejecutados. Un build o cero pruebas no acredita funcionalidad. No desactivar assertions ni usar datos demo como evidencia de producción.

No empezar un módulo financiero sin sus reglas aprobadas. Las dependencias pueden reordenarse con justificación registrada; no omitir criterios. Fase 1 implementada; evidencia de cierre en validacion-fase-1. Fase 2 implementada; evidencia en validacion-fase-2. Fase 3 implementada y validada; evidencia en validacion-fase-3; Fase 4 implementada y validada; evidencia en validacion-fase-4. Fase 5 implementada y validada; evidencia en validacion-fase-5. Fase 6 implementada y validada; evidencia en validacion-fase-6. Fase 7: consolidación técnica local validada con 50 autobuses y 10 usuarios simultáneos; alcance aclarado a uso personal local, con aceptación del usuario en su equipo pendiente. Despliegue empresarial/productivo fuera del alcance vigente; no se considera realizado. Ver validacion-fase-7. Fase 0 entrega propuesta documental; auditoría del anterior no completada por falta de acceso.

## Aclaración de aceptación de Fase 7

Por decisión posterior del usuario, el destino actual es su equipo local personal. Se conserva el criterio original para un eventual despliegue empresarial, pero servidor/dominio/HTTPS no bloquean la entrega local. La revisión automatizada no certifica WCAG ni sustituye aceptación personal. Guía: [uso local personal](uso-local-personal.md).
