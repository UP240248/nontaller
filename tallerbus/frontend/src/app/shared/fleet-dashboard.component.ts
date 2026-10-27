import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FleetApi, FleetMetrics, busStates, stateLabels } from '../core/fleet';
import { WorkflowApi } from '../core/workflow';
import { errorMessage } from '../core/session';
import { IconComponent } from './icon.component';
@Component({selector:'app-fleet-dashboard',standalone:true,imports:[RouterLink,DatePipe,IconComponent],styleUrl:'./fleet-dashboard.component.css',template:`
<section class="operations-dashboard" aria-labelledby="fleet-overview" [attr.aria-busy]="loading()">
 <div class="dashboard-heading"><div><p class="eyebrow">CONTROL DE FLOTA</p><h2 id="fleet-overview">Panorama operativo</h2><p class="dashboard-caption">Información actual para coordinar el taller.</p></div>
  <div class="dashboard-update"><span class="update-time">@if(updatedAt()){Actualizado {{updatedAt() | date:'HH:mm:ss'}}}@else{Pendiente de actualización}</span><button class="secondary" (click)="load()" [disabled]="loading()">{{loading()?'Actualizando…':'Actualizar indicadores'}}</button></div>
 </div>
 @if(error()){<div class="error" role="alert">{{error()}} <button class="text-button" (click)="load()" [disabled]="loading()">Reintentar</button></div>}
 @if(loading()){<div class="dashboard-loading" role="status"><span class="loading-dot" aria-hidden="true"></span> Consultando el estado de la flota…</div>}
 @else if(metrics();as m){
 <div class="dashboard-kpis">
  <article class="metric-tile metric-primary"><div class="metric-title"><span>Flota registrada</span><app-icon name="bus" /></div><strong data-testid="kpi-total">{{m.total}}</strong><small>Total de unidades en el sistema</small></article>
  <article class="metric-tile"><div class="metric-title"><span>Unidades activas</span><span class="metric-icon"><app-icon name="grid" /></span></div><strong data-testid="kpi-active">{{m.activos}}</strong><small>{{m.inactivos}} {{m.inactivos===1?'unidad inactiva':'unidades inactivas'}}</small></article>
  <article class="metric-tile metric-green"><div class="metric-title"><span>Disponibles</span><span class="metric-icon"><app-icon name="bus" /></span></div><strong data-testid="kpi-available">{{m.disponibles}}</strong><small>Activas en estado habilitado</small></article>
  <article class="metric-tile metric-amber"><div class="metric-title"><span>En taller</span><span class="metric-icon"><app-icon name="tools" /></span></div><strong data-testid="kpi-workshop">{{m.enTaller}}</strong><small>Activas en reparación o espera</small></article>
  <article class="metric-tile metric-red"><div class="metric-title"><span>Fallas abiertas</span><span class="metric-icon"><app-icon name="incident" /></span></div><strong data-testid="kpi-incidents">{{openIncidents()??'—'}}</strong><small>{{openIncidents()===null?'Información no disponible':'Pendientes o en proceso'}}</small></article>
 </div>
 @if(incidentError()){<div class="error" role="alert">No se pudieron consultar las fallas. Los indicadores de flota siguen disponibles. <button class="text-button" (click)="load()">Reintentar</button></div>}
 <div class="dashboard-charts">
  <section class="dashboard-panel availability-panel" aria-labelledby="availability-title"><div class="panel-heading"><div><p class="eyebrow">CAPACIDAD OPERATIVA</p><h3 id="availability-title">Disponibilidad de la flota</h3></div><span class="panel-tag">Unidades activas</span></div>
   <div class="availability-content"><div class="availability-ring" [style.--availability]="availability(m)+'%'" role="img" [attr.aria-label]="m.activos?m.disponibles+' de '+m.activos+' unidades activas disponibles, '+availability(m)+' por ciento':'Sin unidades activas para calcular disponibilidad'"><div><strong data-testid="fleet-availability">{{m.activos?availability(m)+'%':'—'}}</strong><span>disponibilidad</span></div></div>
    <div class="availability-legend"><div><span class="legend-dot green" aria-hidden="true"></span><span>Disponibles<strong>{{m.disponibles}} {{m.disponibles===1?'unidad':'unidades'}}</strong></span></div><div><span class="legend-dot neutral" aria-hidden="true"></span><span>No disponibles<strong>{{m.activos-m.disponibles}} {{m.activos-m.disponibles===1?'unidad activa':'unidades activas'}}</strong></span></div></div>
   </div><p class="panel-note">{{m.activos?'Porcentaje de unidades habilitadas sobre el total de activas.':'Registra o activa unidades para ver este indicador.'}}</p>
  </section>
  <section class="dashboard-panel" aria-labelledby="state-title"><div class="panel-heading"><div><p class="eyebrow">ESTADO ACTUAL</p><h3 id="state-title">Distribución de unidades</h3></div><span class="panel-tag">{{m.total}} en total</span></div>
   <div class="distribution-list">@for(state of states;track state){<div class="distribution-row" [attr.data-state]="state"><div class="distribution-label"><span><i class="legend-dot" aria-hidden="true"></i>{{labels[state]}}</span><strong>{{m.porEstado[state]}} <small>{{percent(m.porEstado[state],m.total)}}%</small></strong></div><div class="distribution-track" role="img" [attr.aria-label]="labels[state]+': '+m.porEstado[state]+' de '+m.total+' unidades'"><span [style.width.%]="percent(m.porEstado[state],m.total)"></span></div></div>}</div>
   <p class="panel-note">Incluye unidades activas e inactivas; cada unidad cuenta una sola vez.</p>
  </section>
 </div>
 <section class="dashboard-panel attention-panel" aria-labelledby="attention-title"><div class="panel-heading"><div><p class="eyebrow">SEGUIMIENTO DEL TALLER</p><h3 id="attention-title">Puntos de atención</h3></div><a routerLink="/autobuses">Consultar autobuses →</a></div>
  <div class="attention-grid"><a class="attention-item" routerLink="/fallas"><span class="attention-symbol red"><app-icon name="incident" /></span><span><strong>{{openIncidents()??'—'}} {{openIncidents()===1?'falla abierta':'fallas abiertas'}}</strong><small>{{openIncidents()===null?'Actualiza para volver a consultar.':openIncidents()===0?'No hay reportes pendientes o en proceso.':'Revisa evaluación y seguimiento de reportes.'}}</small></span><span class="attention-arrow" aria-hidden="true">→</span></a>
   <a class="attention-item" routerLink="/autobuses"><span class="attention-symbol amber"><app-icon name="parts" /></span><span><strong>{{m.porEstado.EN_ESPERA_REFACCIONES}} en espera de refacciones</strong><small>Unidades activas e inactivas con este estado.</small></span><span class="attention-arrow" aria-hidden="true">→</span></a>
   <a class="attention-item" routerLink="/autobuses"><span class="attention-symbol slate"><app-icon name="tools" /></span><span><strong>{{m.porEstado.FUERA_DE_SERVICIO}} fuera de servicio</strong><small>Revisa su situación en el catálogo de flota.</small></span><span class="attention-arrow" aria-hidden="true">→</span></a>
  </div>
 </section>
 @if(!m.total){<div class="dashboard-empty"><app-icon name="bus" /><div><strong>Tu panorama comienza con la primera unidad</strong><p>Aún no hay autobuses registrados. El catálogo mostrará los datos cuando estén disponibles.</p></div><a routerLink="/autobuses">Ir a Autobuses →</a></div>}
 <p class="dashboard-footnote">El estado operativo se actualiza manualmente. Estos indicadores no certifican la seguridad de circulación.</p>
 }
</section>`})
export class FleetDashboardComponent implements OnInit {
 private readonly api=inject(FleetApi);private readonly workflow=inject(WorkflowApi);
 readonly openIncidents=signal<number|null>(null);readonly metrics=signal<FleetMetrics|null>(null);readonly loading=signal(false);readonly error=signal('');readonly incidentError=signal(false);readonly updatedAt=signal<Date|null>(null);readonly states=busStates;readonly labels=stateLabels;
 ngOnInit(){void this.load();}
 percent(value:number,total:number){return total?Math.round(value*100/total):0;}
 availability(metrics:FleetMetrics){return this.percent(metrics.disponibles,metrics.activos);}
 async load(){
  if(this.loading())return;
  this.loading.set(true);this.error.set('');this.incidentError.set(false);this.metrics.set(null);this.openIncidents.set(null);this.updatedAt.set(null);
  try{const [fleet,incidents]=await Promise.allSettled([this.api.metrics(),this.workflow.incidentMetrics()]);
   if(fleet.status==='fulfilled'){this.metrics.set(fleet.value);this.updatedAt.set(new Date());}else this.error.set(errorMessage(fleet.reason));
   if(incidents.status==='fulfilled')this.openIncidents.set(incidents.value.abiertas);else this.incidentError.set(true);
  }finally{this.loading.set(false);}
 }
}
