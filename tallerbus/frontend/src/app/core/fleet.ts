import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService, Role } from './session';
export const busStates=['HABILITADO','EN_REPARACION','EN_ESPERA_REFACCIONES','FUERA_DE_SERVICIO'] as const;
export type BusState=typeof busStates[number];
export const stateLabels:Record<BusState,string>={HABILITADO:'Habilitado',EN_REPARACION:'En reparación',EN_ESPERA_REFACCIONES:'En espera de refacciones',FUERA_DE_SERVICIO:'Fuera de servicio'};
export const canReadFleet=(role:Role|undefined)=>role!==undefined&&['ADMINISTRACION','LOGISTICA','MECANICO'].includes(role);
export const canManageFleet=(role:Role|undefined)=>role==='ADMINISTRACION'||role==='LOGISTICA';
export const fleetAccess:CanActivateFn=async()=>{const session=inject(SessionService);const router=inject(Router);await session.restore();return canReadFleet(session.user()?.role)||router.parseUrl('/');};
export const fleetManager:CanActivateFn=async()=>{const session=inject(SessionService);const router=inject(Router);await session.restore();return canManageFleet(session.user()?.role)||router.parseUrl('/');};
export interface Bus {id:string;numeroEconomico:string;placas:string;marca:string;modelo:string;kilometraje:number;estadoOperativo:BusState;activo:boolean;version:number;createdAt:string;updatedAt:string}
export interface Page<T>{data:T[];total:number;page:number;limit:number}
export interface BusHistory {id:string;action:string;createdAt:string;actor:{id:string;name:string}|null;changes:{before?:Record<string,unknown>;after?:Record<string,unknown>;motivo?:string}}
export interface FleetMetrics {total:number;activos:number;inactivos:number;disponibles:number;enTaller:number;porEstado:Record<BusState,number>}
export interface BusFields {numeroEconomico:string;placas:string;marca:string;modelo:string;kilometraje:number}
@Injectable({providedIn:'root'})
export class FleetApi {
 private readonly http=inject(HttpClient);
 list(params:Record<string,string|number>){return firstValueFrom(this.http.get<Page<Bus>>('/api/v1/autobuses',{params}));}
 detail(id:string){return firstValueFrom(this.http.get<Bus>('/api/v1/autobuses/'+id));}
 history(id:string,page=1){return firstValueFrom(this.http.get<Page<BusHistory>>('/api/v1/autobuses/'+id+'/historial',{params:{page,limit:20}}));}
 metrics(){return firstValueFrom(this.http.get<FleetMetrics>('/api/v1/autobuses/metricas'));}
 create(fields:BusFields&{estadoOperativo:BusState}){return firstValueFrom(this.http.post<Bus>('/api/v1/autobuses',fields));}
 update(id:string,fields:BusFields&{version:number;motivo:string}){return firstValueFrom(this.http.patch<Bus>('/api/v1/autobuses/'+id,fields));}
 state(bus:Bus,estadoOperativo:BusState,motivo:string){return firstValueFrom(this.http.patch<Bus>('/api/v1/autobuses/'+bus.id+'/estado',{version:bus.version,estadoOperativo,motivo}));}
 active(bus:Bus,motivo:string){return firstValueFrom(this.http.patch<Bus>('/api/v1/autobuses/'+bus.id+'/activacion',{version:bus.version,activo:!bus.activo,motivo}));}
}
