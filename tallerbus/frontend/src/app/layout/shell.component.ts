import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IconComponent } from '../shared/icon.component';
import { canReadFleet } from '../core/fleet';
import { canReadIncidents, canReadOrders } from '../core/workflow';
import { canReadParts, canOperateInventory } from '../core/inventory';
import { SessionService, roleLabels, errorMessage } from '../core/session';
@Component({standalone:true,imports:[RouterLink,RouterLinkActive,RouterOutlet,IconComponent],template:`
<a class="skip" href="#main">Saltar al contenido</a><div class="app-shell">
 <aside class="sidebar" [class.mobile-open]="menuOpen()" (keydown.escape)="closeMenu()"><div class="mobile-brand-row"><a class="brand" routerLink="/"><span class="brand-mark" aria-hidden="true">T</span><span>TALLERBUS<small>TERRABUS</small></span></a><button #menuButton class="mobile-menu-button" type="button" [attr.aria-expanded]="menuOpen()" aria-controls="primary-navigation" (click)="menuOpen.set(!menuOpen())"><span aria-hidden="true">{{menuOpen()?'×':'☰'}}</span>{{menuOpen()?'Cerrar menú':'Abrir menú'}}</button></div><p class="nav-label">ESPACIO DE TRABAJO</p>
 <nav id="primary-navigation" aria-label="Navegación principal"><a routerLink="/reportes" routerLinkActive="selected"><app-icon name="audit" /> Reportes</a><a routerLink="/" routerLinkActive="selected" [routerLinkActiveOptions]="{exact:true}"><app-icon name="grid" /> Mi espacio</a>
 @if(canReadFleet(session.user()?.role)){<a routerLink="/autobuses" routerLinkActive="selected"><app-icon name="bus" /> Autobuses</a>}
 @if(canReadOrders(session.user()?.role)){<a routerLink="/ordenes" routerLinkActive="selected"><app-icon name="tools" /> Órdenes de trabajo</a>}
 @if(canReadIncidents(session.user()?.role)){<a routerLink="/fallas" routerLinkActive="selected"><app-icon name="incident" /> {{session.user()?.role==='OPERADOR'?'Mis reportes':'Fallas'}}</a>}
 @if(canReadParts(session.user()?.role)){<a routerLink="/mantenimiento" routerLinkActive="selected"><app-icon name="tools" />Mantenimiento</a><a routerLink="/inventario" routerLinkActive="selected"><app-icon name="parts" />Inventario</a><a routerLink="/refacciones" routerLinkActive="selected"><app-icon name="parts" /> Refacciones</a>}
 @if(canOperateInventory(session.user()?.role)){<a routerLink="/compras" routerLinkActive="selected"><app-icon name="audit" /> Compras</a><a routerLink="/proveedores" routerLinkActive="selected"><app-icon name="supplier" /> Proveedores</a>}
 @if(session.user()?.role==='CONTABILIDAD'){<a routerLink="/reportes" [queryParams]="{tipo:'inventario'}" routerLinkActive="selected" [routerLinkActiveOptions]="{paths:'exact',queryParams:'exact',fragment:'ignored',matrixParams:'ignored'}"><app-icon name="parts" /> Inventario (consulta)</a><a routerLink="/reportes" [queryParams]="{tipo:'compras'}" routerLinkActive="selected" [routerLinkActiveOptions]="{paths:'exact',queryParams:'exact',fragment:'ignored',matrixParams:'ignored'}"><app-icon name="audit" /> Compras (consulta)</a>}
 @if(session.user()?.role==='ADMINISTRACION'||session.user()?.role==='LOGISTICA'){<a routerLink="/operadores" routerLinkActive="selected"><app-icon name="bus" /> Unidades de operadores</a>}
 @if(session.user()?.role==='ADMINISTRACION'){<a routerLink="/usuarios" routerLinkActive="selected"><app-icon name="users" /> Usuarios</a><a routerLink="/auditoria" routerLinkActive="selected"><app-icon name="audit" /> Auditoría</a>}
 </nav><div class="sidebar-foot"><span class="status-dot" aria-hidden="true"></span> Operación interna <p>Terrabus · Taller y flota</p></div></aside>
 <div class="workspace"><header class="topbar"><span class="muted">Terrabus <span aria-hidden="true"> / </span> TallerBus</span><div class="session"><span class="avatar" aria-hidden="true">{{session.user()?.name?.slice(0,1)}}</span><span>{{session.user()?.name}}<small>{{labels[session.user()!.role]}}</small></span><button class="secondary" (click)="logout()" [disabled]="busy()">Cerrar sesión</button></div></header>
 @if(error()){<div class="error" role="alert">{{error()}}</div>}<main id="main" tabindex="-1"><router-outlet /></main>
 <footer>Terrabus · Plataforma interna <span>Acceso protegido por permisos</span></footer></div></div>`})
export class ShellComponent {
 readonly menuOpen=signal(false);private readonly document=inject(DOCUMENT);
 @ViewChild('menuButton') menuButton?:ElementRef<HTMLButtonElement>;
 constructor(){this.router.events.pipe(takeUntilDestroyed()).subscribe(event=>{if(event instanceof NavigationEnd){const wasOpen=this.menuOpen();this.menuOpen.set(false);if(wasOpen)this.document.getElementById('main')?.focus();}});}
 closeMenu(){if(this.menuOpen()){this.menuOpen.set(false);this.menuButton?.nativeElement.focus();}}

 readonly canReadOrders=canReadOrders;readonly canReadParts=canReadParts;readonly canOperateInventory=canOperateInventory;readonly canReadIncidents=canReadIncidents;readonly canReadFleet=canReadFleet;readonly session=inject(SessionService);readonly labels=roleLabels;private readonly router=inject(Router);readonly error=signal('');readonly busy=signal(false);
 async logout(){this.busy.set(true);try{await this.session.logout();await this.router.navigateByUrl('/login');}catch(e){this.error.set(errorMessage(e));}finally{this.busy.set(false);}}
}
