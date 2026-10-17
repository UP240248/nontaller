import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FleetDashboardComponent } from '../shared/fleet-dashboard.component';
import { canReadFleet } from '../core/fleet';
import { SessionService, roleLabels } from '../core/session';
@Component({standalone:true,imports:[RouterLink,FleetDashboardComponent],template:`
<div class="page-heading"><div><p class="eyebrow">MI ESPACIO</p><h1>Hola, {{session.user()?.name}}</h1><p class="muted">Tu acceso a TallerBus está listo.</p></div><span class="badge success">Sesión activa</span></div>
@if(canReadFleet(session.user()?.role)){<app-fleet-dashboard />}
<section class="welcome-panel"><div><span class="eyebrow">TERRABUS · EQUIPO INTERNO</span><h2>Todo empieza con un equipo conectado.</h2><p>Consulta tu perfil y accede a las herramientas habilitadas para tu rol.</p></div><span class="welcome-symbol" aria-hidden="true">T</span></section>
<div class="home-grid"><section class="card"><p class="eyebrow">MI CUENTA</p><h2>Información de acceso</h2><dl><div><dt>Nombre</dt><dd>{{session.user()?.name}}</dd></div><div><dt>Correo</dt><dd>{{session.user()?.email}}</dd></div><div><dt>Rol</dt><dd>{{labels[session.user()!.role]}}</dd></div><div><dt>Estado</dt><dd><span class="badge success">Activo</span></dd></div></dl></section>
<section class="card"><p class="eyebrow">HERRAMIENTAS DISPONIBLES</p><h2>Tu espacio de trabajo</h2>
@if(session.user()?.role==='ADMINISTRACION'){<a class="action-card" routerLink="/usuarios"><strong>Administrar usuarios <span aria-hidden="true">↗</span></strong><span>Crear cuentas, asignar roles y controlar el acceso.</span></a><a class="action-card" routerLink="/auditoria"><strong>Consultar auditoría <span aria-hidden="true">↗</span></strong><span>Revisar los cambios y accesos registrados.</span></a>}@else if(canReadFleet(session.user()?.role)){<a class="action-card" routerLink="/autobuses"><strong>Consultar flota →</strong><span>Unidades, estados e historial operativo.</span></a>}@else{<div class="empty compact"><h3>Tu perfil está habilitado</h3><p>Actualmente tu acceso permite consultar esta cuenta. Administración te indicará cuando haya nuevas herramientas disponibles.</p></div>}
</section></div>`})
export class HomeComponent {readonly canReadFleet=canReadFleet;readonly session=inject(SessionService);readonly labels=roleLabels;}
