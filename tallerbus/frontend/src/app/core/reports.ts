import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
export interface ReportDefinition {tipo:string;titulo:string;financiero:boolean;descripcion:string}
export interface ReportColumn {clave:string;titulo:string;tipo:'texto'|'fecha'|'entero'|'decimal'}
export interface ReportData {columnas:ReportColumn[];data:Record<string,string|number|null>[];total:number;resumen:Record<string,string|number>;alcance:string;generadoAt:string;descripcion:string;page:number;limit:number}
@Injectable({providedIn:'root'})
export class ReportsApi {
 private readonly http=inject(HttpClient);
 catalog(){return firstValueFrom(this.http.get<ReportDefinition[]>('/api/v1/reportes/catalogo'));}
 report(type:string,params:Record<string,string|number>){return firstValueFrom(this.http.get<ReportData>('/api/v1/reportes/'+type,{params}));}
 csv(type:string,params:Record<string,string|number>){return firstValueFrom(this.http.get('/api/v1/reportes/'+type+'/csv',{params,responseType:'blob',observe:'response'}));}
}
