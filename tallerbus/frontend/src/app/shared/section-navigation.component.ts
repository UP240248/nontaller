import { Component, computed, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SessionService } from '../core/session';
export interface SectionLink {label:string;description:string;path:string}
@Component({selector:'app-section-navigation',standalone:true,imports:[RouterLink,RouterLinkActive],styleUrl:'./section-navigation.component.css',template:`
@if(items().length>1){<nav class="section-navigation" [attr.aria-label]="title()"><div class="section-navigation-heading"><strong>{{title()}}</strong><span>Selecciona una subpestaña para cambiar de sección.</span></div><div class="section-links">@for(item of items();track item.path){<a [routerLink]="item.path" routerLinkActive="is-active" #active="routerLinkActive" [routerLinkActiveOptions]="match" ariaCurrentWhenActive="page" [attr.aria-label]="item.label"><span class="section-link-top"><strong>{{item.label}}</strong>@if(active.isActive){<span class="current-section" aria-hidden="true">Actual</span>}@else{<span class="section-arrow" aria-hidden="true">→</span>}</span><small>{{item.description}}</small></a>}</div></nav>}`})
export class SectionNavigationComponent {
 readonly title=input.required<string>();readonly items=input.required<SectionLink[]>();
 readonly match={paths:'exact',queryParams:'ignored',matrixParams:'ignored',fragment:'ignored'} as const;
}
@Component({selector:'app-inventory-navigation',standalone:true,imports:[SectionNavigationComponent],template:`<app-section-navigation title="Secciones de inventario" [items]="items()" />`})
export class InventoryNavigationComponent {
 private session=inject(SessionService);
 readonly items=computed<SectionLink[]>(()=>[
  {label:'Existencias',description:'Cantidades disponibles',path:'/inventario'},
  {label:'Catálogo de refacciones',description:'Registrar tipos de piezas',path:'/refacciones'},
  {label:'Fichas con foto',description:'Estado y ubicación de piezas',path:'/inventario/fichas'},
  ...(this.session.user()?.role==='LOGISTICA'?[
   {label:'Movimientos',description:'Entradas, entregas y devoluciones',path:'/inventario/movimientos'},
   {label:'Compras',description:'Pedidos y recepciones',path:'/compras'},
   {label:'Proveedores',description:'Directorio de proveedores',path:'/proveedores'}
  ]:[])
 ]);
}
@Component({selector:'app-people-navigation',standalone:true,imports:[SectionNavigationComponent],template:`<app-section-navigation title="Secciones de personal" [items]="items()" />`})
export class PeopleNavigationComponent {
 private session=inject(SessionService);
 readonly items=computed<SectionLink[]>(()=>[
  ...(this.session.user()?.role==='ADMINISTRACION'?[{label:'Usuarios',description:'Cuentas y permisos',path:'/usuarios'}]:[]),
  {label:'Autobuses autorizados',description:'Asignaciones de operadores',path:'/operadores'}
 ]);
}
