import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { actionLabels } from '../core/workflow';
import { errorMessage } from '../core/session';
interface Event {id:string;entity:string;entityId:string;action:string;createdAt:string;actor:{name:string}|null}
@Component({standalone:true,imports:[DatePipe],template:`
<div class="page-heading"><div><p class="eyebrow">ADMINISTRACIÓN</p><h1>Auditoría</h1><p class="muted">Trazabilidad de accesos y cambios de usuarios. Fechas en UTC.</p></div><button class="secondary" (click)="load()" [disabled]="loading()">Actualizar</button></div>
@if(error()){<div class="error" role="alert">{{error()}}</div>}<section class="card table-card">@if(loading()){<p class="loading" role="status">Cargando eventos…</p>}@else{<div class="table-scroll" role="region" tabindex="0" aria-label="Eventos de auditoría"><table><caption class="sr-only">Eventos de auditoría</caption><thead><tr><th>Fecha UTC</th><th>Responsable</th><th>Acción</th><th>Entidad</th></tr></thead><tbody>@for(event of events();track event.id){<tr><td>{{event.createdAt|date:'dd/MM/yyyy HH:mm:ss':'UTC'}}</td><td>{{event.actor?.name || 'Sistema'}}</td><td><span class="badge">{{actions[event.action] || event.action}}</span></td><td>{{event.entity}}<small>{{event.entityId}}</small></td></tr>}@empty{<tr><td colspan="4"><div class="empty">Todavía no hay eventos registrados.</div></td></tr>}</tbody></table></div>}<div class="pagination"><span>{{total()}} eventos · Página {{page}}</span><div><button class="secondary" (click)="page=page-1;load()" [disabled]="page<=1||loading()">Anterior</button><button class="secondary" (click)="page=page+1;load()" [disabled]="page*20>=total()||loading()">Siguiente</button></div></div></section>`})
export class AuditComponent implements OnInit {
 private readonly http=inject(HttpClient);readonly events=signal<Event[]>([]);readonly loading=signal(false);readonly error=signal('');readonly total=signal(0);page=1;
 readonly actions:Record<string,string>={...actionLabels,LOGIN:'Inicio de sesión',LOGOUT:'Cierre de sesión',CREATE:'Alta de usuario',UPDATE:'Edición de usuario',REVOKE_SESSIONS:'Revocación de sesiones',BOOTSTRAP:'Administrador inicial',DEV_SEED:'Fixture de desarrollo',BUS_CREATE:'Registro de autobús',BUS_UPDATE:'Edición de autobús',BUS_STATE:'Estado operativo',BUS_ACTIVE:'Activación de autobús'};
 ngOnInit(){void this.load();}
 async load(){this.loading.set(true);this.error.set('');try{const p=await firstValueFrom(this.http.get<{data:Event[];total:number}>('/api/v1/audit',{params:{page:this.page,limit:20}}));this.events.set(p.data);this.total.set(p.total);}catch(e){this.error.set(errorMessage(e));}finally{this.loading.set(false);}}
}
