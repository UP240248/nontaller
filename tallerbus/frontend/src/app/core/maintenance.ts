import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Page } from './fleet';
import { Event, Person } from './workflow';
export interface PreventivePlan {id:string;autobusId:string;nombre:string;proximaFecha:string|null;ultimoServicioFecha:string|null;intervaloKm:number|null;ultimoServicioKm:number;checklist:string[];activo:boolean;version:number;proximoKm:number|null;restanKm:number|null;vencido:boolean;autobus:{id:string;numeroEconomico:string;kilometraje:number;activo:boolean};ejecucionActiva:{id:string;ordenId:string;orden:{estado:string};pasos:{completado:boolean}[]}|null}
export interface PreventiveStep {id:string;texto:string;posicion:number;completado:boolean;observaciones:string|null}
export interface PreventiveExecution {id:string;planId:string;ordenId:string;nombre:string;intervaloKm:number|null;baseKm:number;objetivoKm:number|null;fechaProgramada:string|null;fechaServicio:string|null;proximaFecha:string|null;kilometrajeCierre:number|null;finalizadaAt:string|null;createdAt:string;pasos:PreventiveStep[];orden:{id:string;titulo:string;estado:'ABIERTA'|'EN_PROCESO'|'FINALIZADA';version:number;autobus:{numeroEconomico:string;kilometraje:number};asignaciones:{mecanicoId:string;mecanico:Person&{active:boolean;role:string}}[]}}
export interface PlanData {nombre:string;intervaloKm:number|null;proximaFecha?:string;checklist:string[]}
export interface MaintenanceSummary {vencidos:number;proximos:number;enProceso:number;finalizadosMes:number;mes:string}
export interface BusOption {id:string;numeroEconomico:string;kilometraje:number;placas:string}
@Injectable({providedIn:'root'})
export class MaintenanceApi {
 private readonly http=inject(HttpClient);
 summary(){return firstValueFrom(this.http.get<MaintenanceSummary>('/api/v1/mantenimiento/resumen'));}
 services(params:Record<string,string|number>){return firstValueFrom(this.http.get<Page<PreventiveExecution>>('/api/v1/mantenimiento/servicios',{params}));}
 plans(params:Record<string,string|number>){return firstValueFrom(this.http.get<Page<PreventivePlan>>('/api/v1/mantenimiento/planes',{params}));}
 plan(id:string){return firstValueFrom(this.http.get<PreventivePlan>('/api/v1/mantenimiento/planes/'+id));}
 buses(search:string,page=1){return firstValueFrom(this.http.get<Page<BusOption>>('/api/v1/autobuses',{params:{search,activo:'true',page,limit:20}}));}
 create(data:PlanData&{autobusId:string;ultimoServicioKm?:number;mecanicoIds?:string[]}){return firstValueFrom(this.http.post<PreventivePlan>('/api/v1/mantenimiento/planes',data));}
 update(id:string,data:PlanData&{version:number;motivo:string}){return firstValueFrom(this.http.patch<PreventivePlan>('/api/v1/mantenimiento/planes/'+id,data));}
 active(plan:PreventivePlan,motivo:string){return firstValueFrom(this.http.patch('/api/v1/mantenimiento/planes/'+plan.id+'/activacion',{activo:!plan.activo,version:plan.version,motivo}));}
 schedule(plan:PreventivePlan,mecanicoIds:string[],motivo:string,fechaProgramada?:string){return firstValueFrom(this.http.post<PreventiveExecution>('/api/v1/mantenimiento/planes/'+plan.id+'/programar',{version:plan.version,mecanicoIds,motivo,fechaProgramada}));}
 mechanics(){return firstValueFrom(this.http.get<Person[]>('/api/v1/mantenimiento/mecanicos'));}
 executions(id:string,page:number){return firstValueFrom(this.http.get<Page<PreventiveExecution>>('/api/v1/mantenimiento/planes/'+id+'/ejecuciones',{params:{page,limit:20}}));}
 history(id:string,page:number){return firstValueFrom(this.http.get<Page<Event>>('/api/v1/mantenimiento/planes/'+id+'/historial',{params:{page,limit:20}}));}
 execution(id:string){return firstValueFrom(this.http.get<PreventiveExecution>('/api/v1/mantenimiento/ejecuciones/'+id));}
 checklist(execution:PreventiveExecution,pasos:{id:string;completado:boolean;observaciones:string}[],motivo:string){return firstValueFrom(this.http.patch<PreventiveExecution>('/api/v1/mantenimiento/ejecuciones/'+execution.id+'/checklist',{version:execution.orden.version,pasos,motivo}));}
}
