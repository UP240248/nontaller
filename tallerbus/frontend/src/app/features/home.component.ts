import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FleetDashboardComponent } from '../shared/fleet-dashboard.component';
import { canReadFleet } from '../core/fleet';
import { canReadIncidents, canReport } from '../core/workflow';
import { SessionService, roleLabels } from '../core/session';
@Component({standalone:true,imports:[RouterLink,FleetDashboardComponent],template:`
<div class="page-heading"><div><p class="eyebrow">MI ESPACIO</p><h1>Hola, {{session.user()?.name}}</h1><p class="muted">Tu acceso a TallerBus está listo.</p></div><span class="badge success">Sesión activa</span></div>
@if(canReadFleet(session.user()?.role)){<app-fleet-dashboard />}
<section class="welcome-panel"><div><span class="eyebrow">TERRABUS · EQUIPO INTERNO</span><h2>Todo empieza con un equipo conectado.</h2><p>Consulta tu perfil y accede a las herramientas habilitadas para tu rol.</p></div><span class="welcome-symbol" aria-hidden="true">T</span></section>
<div class="home-grid"><section class="card"><p class="eyebrow">MI CUENTA</p><h2>Información de acceso</h2><dl><div><dt>Nombre</dt><dd>{{session.user()?.name}}</dd></div><div><dt>Correo</dt><dd>{{session.user()?.email}}</dd></div><div><dt>Rol</dt><dd>{{labels[session.user()!.role]}}</dd></div><div><dt>Estado</dt><dd><span class="badge success">Activo</span></dd></div></dl></section>
<section class="card"><p class="eyebrow">HERRAMIENTAS DISPONIBLES</p><h2>Tu espacio de trabajo</h2><a class="action-card" routerLink="/reportes"><strong>Consultar reportes y exportar CSV →</strong><span>Consulta y descarga los reportes habilitados para tu rol.</span></a>
@if(canReadIncidents(session.user()?.role)){<a class="action-card" routerLink="/fallas"><strong>{{session.user()?.role==='OPERADOR'?'Mis reportes':'Seguimiento de fallas'}} →</strong><span>Consulta reportes, evaluación y avance de la atención.</span></a>}@if(canReport(session.user()?.role)){<a class="action-card" routerLink="/fallas/nueva"><strong>Reportar falla →</strong><span>Describe una incidencia y adjunta evidencias.</span></a>}
@if(session.user()?.role==='ADMINISTRACION'){<a class="action-card" routerLink="/usuarios"><strong>Administrar usuarios <span aria-hidden="true">↗</span></strong><span>Crear cuentas, asignar roles y controlar el acceso.</span></a><a class="action-card" routerLink="/auditoria"><strong>Consultar auditoría <span aria-hidden="true">↗</span></strong><span>Revisar los cambios y accesos registrados.</span></a>}@else if(canReadFleet(session.user()?.role)){<a class="action-card" routerLink="/autobuses"><strong>Consultar flota →</strong><span>Unidades, estados e historial operativo.</span></a>}@else if(!canReadIncidents(session.user()?.role)){<div class="empty compact"><h3>Tu perfil está habilitado</h3><p>Contabilidad puede consultar compras, valoración de inventario y costos de refacciones desde Reportes.</p></div>}
</section></div>`})
export class HomeComponent {readonly canReadIncidents=canReadIncidents;readonly canReport=canReport;readonly canReadFleet=canReadFleet;readonly session=inject(SessionService);readonly labels=roleLabels;}
