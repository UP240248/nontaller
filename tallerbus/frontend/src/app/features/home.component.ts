import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FleetDashboardComponent } from '../shared/fleet-dashboard.component';
import { canReadFleet } from '../core/fleet';
import { canReadIncidents, canReport } from '../core/workflow';
import { SessionService, roleLabels } from '../core/session';
@Component({standalone:true,imports:[RouterLink,FleetDashboardComponent],template:`
<div class="page-heading"><div><p class="eyebrow">MI ESPACIO</p><h1>Hola, {{session.user()?.name}}</h1><p class="muted">Consulta el estado de la operación y continúa con tus tareas.</p></div><span class="badge success">{{labels[session.user()!.role]}} · Sesión activa</span></div>
@if(canReadFleet(session.user()?.role)){<app-fleet-dashboard />}

<div class="home-grid"><section class="card"><p class="eyebrow">MI CUENTA</p><h2>Tu perfil</h2><dl><div><dt>Nombre</dt><dd>{{session.user()?.name}}</dd></div><div><dt>Usuario</dt><dd>{{session.user()?.username}}</dd></div><div><dt>Rol</dt><dd>{{labels[session.user()!.role]}}</dd></div><div><dt>Estado</dt><dd><span class="badge success">Activo</span></dd></div></dl></section>
<section class="card"><p class="eyebrow">CONTINÚA TU JORNADA</p><h2>Accesos de trabajo</h2><a class="action-card" routerLink="/reportes"><strong>Consultar reportes y exportar CSV →</strong><span>Consulta y descarga los reportes habilitados para tu rol.</span></a>
@if(canReadIncidents(session.user()?.role)){<a class="action-card" routerLink="/fallas"><strong>{{session.user()?.role==='OPERADOR'?'Mis reportes':'Seguimiento de fallas'}} →</strong><span>Consulta reportes, evaluación y avance de la atención.</span></a>}@if(canReport(session.user()?.role)){<a class="action-card" routerLink="/fallas/nueva"><strong>Reportar falla →</strong><span>Describe una incidencia y adjunta evidencias.</span></a>}
@if(session.user()?.role==='ADMINISTRACION'){<a class="action-card" routerLink="/usuarios"><strong>Administrar usuarios <span aria-hidden="true">↗</span></strong><span>Crear cuentas, asignar roles y controlar el acceso.</span></a><a class="action-card" routerLink="/auditoria"><strong>Consultar auditoría <span aria-hidden="true">↗</span></strong><span>Revisar los cambios y accesos registrados.</span></a>}@else if(canReadFleet(session.user()?.role)){<a class="action-card" routerLink="/autobuses"><strong>Consultar flota →</strong><span>Unidades, estados e historial operativo.</span></a>}@else if(!canReadIncidents(session.user()?.role)){<div class="empty compact"><h3>Tu perfil está habilitado</h3><p>Contabilidad puede consultar compras, valoración de inventario y costos de refacciones desde Reportes.</p></div>}
</section></div>`})
export class HomeComponent {readonly canReadIncidents=canReadIncidents;readonly canReport=canReport;readonly canReadFleet=canReadFleet;readonly session=inject(SessionService);readonly labels=roleLabels;}
