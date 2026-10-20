import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Role, SessionService } from './session';
import { Page } from './fleet';
import { Event } from './workflow';
export const canReadParts=(role:Role|undefined)=>role==='ADMINISTRACION'||role==='LOGISTICA'||role==='MECANICO';
export const canOperateInventory=(role:Role|undefined)=>role==='LOGISTICA';
export const partsAccess:CanActivateFn=async()=>{const s=inject(SessionService);const r=inject(Router);await s.restore();return canReadParts(s.user()?.role)||r.parseUrl('/');};
export const logisticsAccess:CanActivateFn=async()=>{const s=inject(SessionService);const r=inject(Router);await s.restore();return canOperateInventory(s.user()?.role)||r.parseUrl('/');};
interface CatalogBase {id:string;activo:boolean;version:number;createdAt:string;updatedAt:string}
export interface Part extends CatalogBase {sku:string;descripcion:string;unidad:string;categoria:string|null;minimo:string}
export interface Supplier extends CatalogBase {codigo:string;nombre:string;contacto:string|null;email:string|null;telefono:string|null}
export type CatalogRow=Part|Supplier;
export interface PartData {sku:string;descripcion:string;unidad:string;categoria:string;minimo:string}
export interface SupplierData {codigo:string;nombre:string;contacto:string;email:string;telefono:string}
@Injectable({providedIn:'root'})
export class InventoryApi {
 private readonly http=inject(HttpClient);
 parts(params:Record<string,string|number>){return firstValueFrom(this.http.get<Page<Part>>('/api/v1/refacciones',{params}));}
 suppliers(params:Record<string,string|number>){return firstValueFrom(this.http.get<Page<Supplier>>('/api/v1/proveedores',{params}));}
 part(id:string){return firstValueFrom(this.http.get<Part>('/api/v1/refacciones/'+id));}
 supplier(id:string){return firstValueFrom(this.http.get<Supplier>('/api/v1/proveedores/'+id));}
 createPart(data:PartData){return firstValueFrom(this.http.post<Part>('/api/v1/refacciones',data));}
 createSupplier(data:SupplierData){return firstValueFrom(this.http.post<Supplier>('/api/v1/proveedores',data));}
 updatePart(id:string,data:PartData&{version:number;motivo:string}){return firstValueFrom(this.http.patch<Part>('/api/v1/refacciones/'+id,data));}
 updateSupplier(id:string,data:SupplierData&{version:number;motivo:string}){return firstValueFrom(this.http.patch<Supplier>('/api/v1/proveedores/'+id,data));}
 active(row:CatalogRow,motivo:string){const resource='sku' in row?'refacciones':'proveedores';return firstValueFrom(this.http.patch<CatalogRow>('/api/v1/'+resource+'/'+row.id+'/activacion',{activo:!row.activo,version:row.version,motivo}));}
 history(id:string,supplier:boolean,page=1){return firstValueFrom(this.http.get<Page<Event>>('/api/v1/'+(supplier?'proveedores':'refacciones')+'/'+id+'/historial',{params:{page,limit:20}}));}
}
