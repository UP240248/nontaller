import { Routes } from '@angular/router';
import { fleetAccess, fleetManager } from './core/fleet';
import { incidentAccess, reportAccess } from './core/workflow';
import { administrator, signedIn } from './core/session';
export const routes: Routes = [
 {path:'login',loadComponent:()=>import('./features/login.component').then(m=>m.LoginComponent)},
 {path:'',canActivate:[signedIn],loadComponent:()=>import('./layout/shell.component').then(m=>m.ShellComponent),children:[
  {path:'',pathMatch:'full',loadComponent:()=>import('./features/home.component').then(m=>m.HomeComponent)},
  {path:'autobuses',canActivate:[fleetAccess],loadComponent:()=>import('./features/fleet/fleet-list.component').then(m=>m.FleetListComponent)},
  {path:'autobuses/nuevo',canActivate:[fleetManager],loadComponent:()=>import('./features/fleet/bus-editor.component').then(m=>m.BusEditorComponent)},
  {path:'autobuses/:id/editar',canActivate:[fleetManager],loadComponent:()=>import('./features/fleet/bus-editor.component').then(m=>m.BusEditorComponent)},
  {path:'autobuses/:id',canActivate:[fleetAccess],loadComponent:()=>import('./features/fleet/bus-detail.component').then(m=>m.BusDetailComponent)},
  {path:'fallas',canActivate:[incidentAccess],loadComponent:()=>import('./features/incidents/incident-list.component').then(m=>m.IncidentListComponent)},
  {path:'fallas/nueva',canActivate:[reportAccess],loadComponent:()=>import('./features/incidents/incident-report.component').then(m=>m.IncidentReportComponent)},
  {path:'fallas/:id',canActivate:[incidentAccess],loadComponent:()=>import('./features/incidents/incident-detail.component').then(m=>m.IncidentDetailComponent)},
  {path:'ordenes',canActivate:[fleetAccess],loadComponent:()=>import('./features/work-orders/order-list.component').then(m=>m.OrderListComponent)},
  {path:'ordenes/nueva',canActivate:[fleetManager],loadComponent:()=>import('./features/work-orders/order-create.component').then(m=>m.OrderCreateComponent)},
  {path:'ordenes/:id',canActivate:[fleetAccess],loadComponent:()=>import('./features/work-orders/order-detail.component').then(m=>m.OrderDetailComponent)},
  {path:'usuarios',canActivate:[administrator],loadComponent:()=>import('./features/users.component').then(m=>m.UsersComponent)},
  {path:'auditoria',canActivate:[administrator],loadComponent:()=>import('./features/audit.component').then(m=>m.AuditComponent)}
 ]},
 {path:'**',redirectTo:''}
];
