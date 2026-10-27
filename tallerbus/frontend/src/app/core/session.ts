import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router, CanActivateFn } from '@angular/router';
import { catchError, firstValueFrom, throwError } from 'rxjs';
export const roles = ['ADMINISTRACION','LOGISTICA','MECANICO','OPERADOR','CONTABILIDAD'] as const;
export type Role = typeof roles[number];
export const roleLabels: Record<Role,string> = {ADMINISTRACION:'Administración',LOGISTICA:'Logística',MECANICO:'Mecánico',OPERADOR:'Operador',CONTABILIDAD:'Contabilidad'};
export interface User { id:string;name:string;username:string;role:Role;active:boolean;version:number }
interface Session {user:User;csrfToken:string}
@Injectable({providedIn:'root'})
export class SessionService {
  private readonly http = inject(HttpClient);
  readonly user = signal<User|null>(null);
  private csrf = '';
  private pending: Promise<boolean>|null = null;
  token() {return this.csrf;}
  clear() {this.user.set(null);this.csrf='';}
  async restore(): Promise<boolean> {
    if (this.user()) return true;
    if (this.pending) return this.pending;
    this.pending = firstValueFrom(this.http.get<Session>('/api/v1/auth/me')).then(s=>{this.user.set(s.user);this.csrf=s.csrfToken;return true;}).catch(()=>false).finally(()=>this.pending=null);
    return this.pending;
  }
  async login(username:string,password:string): Promise<void> {
    const s = await firstValueFrom(this.http.post<Session>('/api/v1/auth/login',{username,password}));
    this.user.set(s.user);this.csrf=s.csrfToken;
  }
  async logout(): Promise<void> {await firstValueFrom(this.http.post('/api/v1/auth/logout',{}));this.clear();}
}
export const sessionInterceptor: HttpInterceptorFn = (req,next)=>{
  const session = inject(SessionService);const router=inject(Router);
  if (!req.url.startsWith('/api/')) return next(req);
  const csrf = session.token();
  return next(req.clone({withCredentials:true,...(csrf && !['GET','HEAD','OPTIONS'].includes(req.method)?{setHeaders:{'X-CSRF-Token':csrf}}:{})})).pipe(catchError((error:unknown)=>{
    if(error instanceof HttpErrorResponse && error.status===401 && !req.url.endsWith('/login')) {session.clear();void router.navigateByUrl('/login');}
    return throwError(()=>error);
  }));
};
export const signedIn: CanActivateFn=async()=>{
  const session=inject(SessionService);const router=inject(Router);
  return await session.restore() || router.parseUrl('/login');
};
export const administrator: CanActivateFn=async()=>{
  const session=inject(SessionService);const router=inject(Router);
  if(!await session.restore()) return router.parseUrl('/login');
  return session.user()?.role==='ADMINISTRACION' || router.parseUrl('/');
};
export function errorMessage(error:unknown): string {
  if(error instanceof HttpErrorResponse) {
    if(error.status===0) return 'No se pudo conectar con el servidor. Comprueba la conexión e intenta de nuevo.';
    const body:unknown=error.error;
    if(body && typeof body==='object' && 'message' in body) {
      const message=(body as {message:unknown}).message;
      if(typeof message==='string') return message;
      if(Array.isArray(message)) return 'Revisa los datos del formulario.';
    }
  }
  return 'No se pudo completar la operación. Intenta de nuevo.';
}
