import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IconComponent } from '../shared/icon.component';
import { canReadFleet } from '../core/fleet';
import { canReadIncidents } from '../core/workflow';
import { canReadParts, canOperateInventory } from '../core/inventory';
import { SessionService, roleLabels, errorMessage } from '../core/session';
@Component({standalone:true,imports:[RouterLink,RouterLinkActive,RouterOutlet,IconComponent],template:`
<a class="skip" href="#main">Saltar al contenido</a><div class="app-shell">
 <aside class="sidebar"><a class="brand" routerLink="/"><span class="brand-mark" aria-hidden="true">T</span><span>TALLERBUS<small>TERRABUS</small></span></a><p class="nav-label">ESPACIO DE TRABAJO</p>
 <nav aria-label="Navegación principal"><a routerLink="/" routerLinkActive="selected" [routerLinkActiveOptions]="{exact:true}"><app-icon name="grid" /> Mi espacio</a>
 @if(canReadFleet(session.user()?.role)){<a routerLink="/autobuses" routerLinkActive="selected"><app-icon name="bus" /> Autobuses</a><a routerLink="/ordenes" routerLinkActive="selected"><app-icon name="tools" /> Órdenes de trabajo</a>}
 @if(canReadIncidents(session.user()?.role)){<a routerLink="/fallas" routerLinkActive="selected"><app-icon name="incident" /> {{session.user()?.role==='OPERADOR'?'Mis reportes':'Fallas'}}</a>}
 @if(canReadParts(session.user()?.role)){<a routerLink="/mantenimiento" routerLinkActive="selected"><app-icon name="tools" />Mantenimiento</a><a routerLink="/inventario" routerLinkActive="selected"><app-icon name="parts" />Inventario</a><a routerLink="/refacciones" routerLinkActive="selected"><app-icon name="parts" /> Refacciones</a>}
 @if(canOperateInventory(session.user()?.role)){<a routerLink="/proveedores" routerLinkActive="selected"><app-icon name="supplier" /> Proveedores</a>}
 @if(session.user()?.role==='ADMINISTRACION'){<a routerLink="/usuarios" routerLinkActive="selected"><app-icon name="users" /> Usuarios</a><a routerLink="/auditoria" routerLinkActive="selected"><app-icon name="audit" /> Auditoría</a>}
 </nav><div class="sidebar-foot"><span class="status-dot" aria-hidden="true"></span> Operación interna <p>Terrabus · Taller y flota</p></div></aside>
 <div class="workspace"><header class="topbar"><span class="muted">Terrabus <span aria-hidden="true"> / </span> TallerBus</span><div class="session"><span class="avatar" aria-hidden="true">{{session.user()?.name?.slice(0,1)}}</span><span>{{session.user()?.name}}<small>{{labels[session.user()!.role]}}</small></span><button class="secondary" (click)="logout()" [disabled]="busy()">Cerrar sesión</button></div></header>
 @if(error()){<div class="error" role="alert">{{error()}}</div>}<main id="main" tabindex="-1"><router-outlet /></main>
 <footer>Terrabus · Plataforma interna <span>Acceso protegido por permisos</span></footer></div></div>`})
export class ShellComponent {
 readonly canReadParts=canReadParts;readonly canOperateInventory=canOperateInventory;readonly canReadIncidents=canReadIncidents;readonly canReadFleet=canReadFleet;readonly session=inject(SessionService);readonly labels=roleLabels;private readonly router=inject(Router);readonly error=signal('');readonly busy=signal(false);
 async logout(){this.busy.set(true);try{await this.session.logout();await this.router.navigateByUrl('/login');}catch(e){this.error.set(errorMessage(e));}finally{this.busy.set(false);}}
}
