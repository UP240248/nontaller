import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CanActivateFn, Router } from '@angular/router';
import { Role, SessionService } from './session';
import { Page } from './fleet';
export const canReadIncidents=(role:Role|undefined)=>!!role&&role!=='CONTABILIDAD';
export const canReport=(role:Role|undefined)=>role==='OPERADOR'||role==='MECANICO';
export const canCoordinate=(role:Role|undefined)=>role==='ADMINISTRACION'||role==='LOGISTICA';
export const incidentAccess:CanActivateFn=async()=>{const s=inject(SessionService);const r=inject(Router);await s.restore();return canReadIncidents(s.user()?.role)||r.parseUrl('/');};
export const reportAccess:CanActivateFn=async()=>{const s=inject(SessionService);const r=inject(Router);await s.restore();return canReport(s.user()?.role)||r.parseUrl('/');};
export type IncidentState='PENDIENTE'|'EN_PROCESO'|'FINALIZADA';
export type Priority='BAJA'|'MEDIA'|'ALTA'|'CRITICA';
export const priorities:Priority[]=['BAJA','MEDIA','ALTA','CRITICA'];
export const priorityLabels:Record<Priority,string>={BAJA:'Baja',MEDIA:'Media',ALTA:'Alta',CRITICA:'Crítica'};
export const incidentStates:IncidentState[]=['PENDIENTE','EN_PROCESO','FINALIZADA'];
export const incidentLabels:Record<IncidentState,string>={PENDIENTE:'Pendiente',EN_PROCESO:'En proceso',FINALIZADA:'Finalizada'};
export const orderLabels={ABIERTA:'Abierta',EN_PROCESO:'En proceso',FINALIZADA:'Finalizada'};
export interface Person {id:string;name:string}
export interface Evidence {id:string;mime:string;size:number;createdAt:string;autor?:Person}
export interface Incident {id:string;autobusId:string;ordenId:string|null;descripcion:string;tipo:string;estado:IncidentState;prioridad:Priority|null;evaluacion:string|null;evaluadoAt:string|null;version:number;createdAt:string;updatedAt:string;reportanteId:string;autobus:{id:string;numeroEconomico:string};reportante:Person;evaluadoPor:Person|null;evidencias:Evidence[]}
export interface Event {id:string;action:string;createdAt:string;changes:Record<string,unknown>|null;actor:Person|null}
export const actionLabels:Record<string,string>={PREVENTIVE_PLAN_CREATE:'Alta de plan preventivo',PREVENTIVE_PLAN_UPDATE:'Edición de plan preventivo',PREVENTIVE_PLAN_ACTIVE:'Activación de plan preventivo',PREVENTIVE_SCHEDULE:'Programación de preventivo',PREVENTIVE_CHECKLIST:'Registro de checklist',PREVENTIVE_FINISH:'Preventivo finalizado',ORDER_CREATE_PREVENTIVE:'Creación de orden preventiva',STOCK_ENTRADA:'Entrada de almacén',STOCK_ENTREGA:'Entrega a orden',STOCK_DEVOLUCION:'Devolución de piezas',STOCK_AJUSTE:'Ajuste de existencia',STOCK_RECEPCION:'Recepción de compra',PURCHASE_CREATE:'Borrador de compra',PURCHASE_APPROVE:'Compra aprobada',PURCHASE_CANCEL:'Compra cancelada',PURCHASE_RECEIVE:'Recepción registrada',PART_CREATE:'Alta de refacción',PART_UPDATE:'Edición de refacción',PART_ACTIVE:'Activación de refacción',SUPPLIER_CREATE:'Alta de proveedor',SUPPLIER_UPDATE:'Edición de proveedor',SUPPLIER_ACTIVE:'Activación de proveedor',INCIDENT_REPORT:'Reporte de falla',INCIDENT_EVALUATE:'Evaluación mecánica',INCIDENT_EVIDENCE:'Evidencia adjunta',INCIDENT_LINK_ORDER:'Vinculación a orden',INCIDENT_START:'Inicio de atención',INCIDENT_FINISH:'Falla finalizada',ORDER_CREATE:'Creación de orden',ORDER_ASSIGN:'Asignación de mecánicos',ORDER_START:'Inicio de trabajo',ORDER_WAIT:'Cambio de espera de refacciones',ORDER_FINISH:'Finalización de orden'};
export interface Assignment {id:string;mecanicoId:string;retiradoAt:string|null;createdAt:string;mecanico:Person&{active:boolean;role:Role};asignadoPor:Person}
export interface Part {descripcion:string;cantidad:string;unidad:string}
export interface Completion {id:string;trabajoRealizado:string;observaciones:string;fechaFinalizacion:string;aplicoManoObra:boolean;manoObraMinutos:number;aplicaronRefacciones:boolean;responsable:Person;refacciones:(Part&{id:string})[]}
export interface WorkOrder {preventivo:{id:string;planId:string}|null;id:string;autobusId:string;titulo:string;estado:keyof typeof orderLabels;diagnostico:string|null;esperaRefacciones:boolean;startedAt:string|null;createdAt:string;updatedAt:string;version:number;autobus:{id:string;numeroEconomico:string;kilometraje:number};fallas:Pick<Incident,'id'|'tipo'|'descripcion'|'estado'|'prioridad'>[];asignaciones:Assignment[];finalizacion:Completion|null}
export interface FinishData {kilometrajePreventivo?:number;version:number;motivo:string;trabajoRealizado:string;observaciones:string;aplicoManoObra:boolean;manoObraMinutos:number;aplicaronRefacciones:boolean;refacciones:Part[]}
@Injectable({providedIn:'root'})
export class WorkflowApi {
 private readonly http=inject(HttpClient);
 incidentMetrics(){return firstValueFrom(this.http.get<{abiertas:number}>('/api/v1/fallas/metricas'));}
 incidents(params:Record<string,string|number>){return firstValueFrom(this.http.get<Page<Incident>>('/api/v1/fallas',{params}));}
 incident(id:string){return firstValueFrom(this.http.get<Incident>('/api/v1/fallas/'+id));}
 report(data:{numeroEconomico:string;descripcion:string;tipo:string}){return firstValueFrom(this.http.post<Incident>('/api/v1/fallas',data));}
 evaluate(incident:Incident,data:{prioridad:Priority;evaluacion:string;motivo:string}){return firstValueFrom(this.http.patch<Incident>('/api/v1/fallas/'+incident.id+'/evaluacion',{...data,version:incident.version}));}
 incidentHistory(id:string,page=1){return firstValueFrom(this.http.get<Page<Event>>('/api/v1/fallas/'+id+'/historial',{params:{page,limit:20}}));}
 upload(id:string,file:File){const data=new FormData();data.append('file',file);return firstValueFrom(this.http.post<Evidence>('/api/v1/fallas/'+id+'/evidencias',data));}
 evidenceUrl(id:string,evidenceId:string){return '/api/v1/fallas/'+id+'/evidencias/'+evidenceId;}
 orders(params:Record<string,string|number>){return firstValueFrom(this.http.get<Page<WorkOrder>>('/api/v1/ordenes',{params}));}
 order(id:string){return firstValueFrom(this.http.get<WorkOrder>('/api/v1/ordenes/'+id));}
 createOrder(titulo:string,fallaIds:string[]){return firstValueFrom(this.http.post<WorkOrder>('/api/v1/ordenes',{titulo,fallaIds}));}
 mechanics(){return firstValueFrom(this.http.get<Person[]>('/api/v1/ordenes/mecanicos'));}
 assign(order:WorkOrder,mecanicoIds:string[],motivo:string){return firstValueFrom(this.http.patch<WorkOrder>('/api/v1/ordenes/'+order.id+'/asignaciones',{version:order.version,mecanicoIds,motivo}));}
 start(order:WorkOrder,diagnostico:string,motivo:string){return firstValueFrom(this.http.post<WorkOrder>('/api/v1/ordenes/'+order.id+'/iniciar',{version:order.version,diagnostico,motivo}));}
 wait(order:WorkOrder,motivo:string){return firstValueFrom(this.http.patch<WorkOrder>('/api/v1/ordenes/'+order.id+'/espera',{version:order.version,esperaRefacciones:!order.esperaRefacciones,motivo}));}
 finish(id:string,data:FinishData){return firstValueFrom(this.http.post<WorkOrder>('/api/v1/ordenes/'+id+'/finalizar',data));}
 orderHistory(id:string,page=1){return firstValueFrom(this.http.get<Page<Event>>('/api/v1/ordenes/'+id+'/historial',{params:{page,limit:20}}));}
}
