import { PhotoPickerComponent } from '../../shared/photo-picker.component';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Incident, WorkflowApi } from '../../core/workflow';
import { SessionService, errorMessage } from '../../core/session';
@Component({standalone:true,imports:[PhotoPickerComponent,ReactiveFormsModule,RouterLink],styles:[`fieldset{border:0;padding:0;margin:0;min-width:0}`],template:`
<a class="back-link" routerLink="/fallas">← Reportes</a><div class="page-heading"><div><p class="eyebrow">REPORTE DE INCIDENCIA</p><h1>Reportar falla</h1><p class="muted">Describe lo que observaste. Un mecánico confirmará la prioridad.</p></div></div><section class="card editor-card"><form [formGroup]="form" (ngSubmit)="save()"><fieldset [disabled]="busy()||!!created()">@if(operator()){
<label for="report-bus">Autobús autorizado</label><select id="report-bus" formControlName="numeroEconomico" required [attr.aria-describedby]="'bus-hint'"><option value="">Selecciona el autobús de este reporte</option>@for(u of units();track u.id){<option [value]="u.numeroEconomico">{{u.numeroEconomico}} · {{u.placas}}</option>}</select><p id="bus-hint" class="fine">Solo puedes elegir una de tus unidades activas autorizadas. La selección es obligatoria para cada reporte.</p>
@if(unitsLoading()){<p role="status">Consultando tus unidades…</p>}@else if(unitsError()){<p class="error" role="alert">{{unitsError()}}</p>}@else if(!units().length){<p class="notice" role="status">No tienes unidades activas autorizadas. Administración debe realizar la primera asignación; después Administración o Logística puede cambiarla.</p>}
<button type="button" class="secondary" [disabled]="unitsLoading()||busy()" (click)="loadUnits()">Actualizar mis unidades</button>
}@else{<label for="report-bus">Número económico de la unidad</label><input id="report-bus" formControlName="numeroEconomico" maxlength="30" required aria-describedby="bus-hint"><p id="bus-hint" class="fine">Escribe el número de una unidad activa que conozcas.</p>}
<label for="report-type">Tipo de falla</label><input id="report-type" formControlName="tipo" maxlength="60" placeholder="Ej. Frenos, eléctrico, carrocería" required><label for="report-description">Descripción de la falla</label><textarea id="report-description" formControlName="descripcion" rows="6" minlength="10" maxlength="2000" required aria-describedby="description-hint"></textarea><p id="description-hint" class="fine">Al menos 10 caracteres. Puedes adjuntar una foto ahora y agregar más después.</p></fieldset>
<app-photo-picker inputId="report-photo" label="Foto de la falla (opcional)" [disabled]="busy()" (fileChange)="photo.set($event)" />
@if(created();as saved){<p class="notice" role="status">El reporte ya fue guardado. Puedes reintentar la foto o <a [routerLink]="['/fallas',saved.id]">abrir el reporte guardado</a> sin adjuntarla.</p>}@if(error()){<div class="error" role="alert">{{error()}}</div>}<div class="dialog-actions"><a class="secondary button-link" [routerLink]="created()?['/fallas',created()!.id]:['/fallas']">{{created()?'Ver reporte guardado':'Cancelar'}}</a><button class="primary" [disabled]="busy()||(!created()&&operator()&&(unitsLoading()||!!unitsError()||!units().length))">{{busy()?'Guardando…':created()?(photo()?'Reintentar foto y abrir reporte':'Abrir reporte guardado'):'Guardar reporte'}}</button></div></form></section>`})
export class IncidentReportComponent implements OnInit {
 readonly session=inject(SessionService);readonly operator=()=>this.session.user()?.role==='OPERADOR';readonly units=signal<{id:string;numeroEconomico:string;placas:string}[]>([]);readonly unitsLoading=signal(false);readonly unitsError=signal('');readonly photo=signal<File|null>(null);readonly created=signal<Incident|null>(null);
 private readonly api=inject(WorkflowApi);private readonly fb=inject(FormBuilder);private readonly router=inject(Router);readonly error=signal('');readonly busy=signal(false);
 readonly form=this.fb.nonNullable.group({numeroEconomico:['',[Validators.required,Validators.maxLength(30)]],tipo:['',[Validators.required,Validators.minLength(2),Validators.maxLength(60)]],descripcion:['',[Validators.required,Validators.minLength(10),Validators.maxLength(2000)]]});
 ngOnInit(){if(this.operator())void this.loadUnits();}
 async loadUnits(){this.unitsLoading.set(true);this.unitsError.set('');try{this.units.set((await this.api.operatorUnits()).data);if(!this.units().some(u=>u.numeroEconomico===this.form.controls.numeroEconomico.value))this.form.controls.numeroEconomico.setValue('');}catch(e){this.units.set([]);this.unitsError.set(errorMessage(e));}finally{this.unitsLoading.set(false);}}
 async save(){if(this.busy())return;if(!this.created()){
  if(this.operator()&&!this.units().some(u=>u.numeroEconomico===this.form.controls.numeroEconomico.value)){this.error.set('Selecciona uno de tus autobuses autorizados.');return;}
  if(this.form.invalid){this.form.markAllAsTouched();this.error.set('Revisa unidad, tipo y descripción (al menos 10 caracteres).');return;}
 }
 this.busy.set(true);this.error.set('');try{
  let incident=this.created();if(!incident){incident=await this.api.report(this.form.getRawValue());this.created.set(incident);}
  const photo=this.photo();if(photo){try{await this.api.upload(incident.id,photo);this.photo.set(null);}catch(e){this.error.set('El reporte ya fue guardado, pero la foto no se pudo subir: '+errorMessage(e)+'. Reintenta la foto o abre el reporte guardado; no necesitas crearlo otra vez.');return;}}
  await this.router.navigate(['/fallas',incident.id]);
 }catch(e){this.error.set(errorMessage(e));}finally{this.busy.set(false);}}
}
