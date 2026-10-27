import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService, errorMessage } from '../core/session';
@Component({standalone:true,imports:[ReactiveFormsModule],template:`
<main class="login-page">
 <section class="login-story" aria-label="TallerBus Terrabus">
  <div class="brand"><span class="brand-mark" aria-hidden="true">T</span> TALLERBUS <small>TERRABUS</small></div>
  <div><p class="eyebrow light">OPERACIÓN INTERNA · TERRABUS</p><h1>Un solo lugar.<br>Todo tu equipo.</h1><p class="story-copy">Accede de forma segura al espacio de trabajo de Terrabus.</p></div>
  <p class="story-foot">Flota propia. Trabajo en equipo.</p>
 </section>
 <section class="login-form-wrap"><div class="login-form">
  <p class="eyebrow">BIENVENIDO A TALLERBUS</p><h2>Inicia sesión</h2><p class="muted">Usa la cuenta que te proporcionó Administración.</p>
  <form [formGroup]="form" (ngSubmit)="submit()">
   <label for="username">Usuario de acceso</label><input id="username" type="text" formControlName="username" autocomplete="username" placeholder="ej. juan.perez" [attr.aria-invalid]="form.controls.username.touched && form.controls.username.invalid" aria-describedby="username-help">
   @if(form.controls.username.touched && form.controls.username.invalid){<p id="username-help" class="field-error">Usa de 3 a 40 letras, números, puntos, guiones o guiones bajos.</p>}
   <label for="password">Contraseña</label><input id="password" type="password" formControlName="password" autocomplete="current-password" [attr.aria-invalid]="form.controls.password.touched && form.controls.password.invalid">
   @if(error()){<div class="error" role="alert">{{error()}}</div>}
   <button class="primary full" type="submit" [disabled]="busy()">{{busy()?'Ingresando…':'Entrar a TallerBus'}} <span aria-hidden="true">→</span></button>
  </form>
  <p class="login-help">¿Necesitas acceso? Contacta a Administración.</p><p class="fine">Acceso exclusivo para personal autorizado de Terrabus.</p>
 </div></section>
</main>`})
export class LoginComponent {
 private readonly fb=inject(FormBuilder);private readonly session=inject(SessionService);private readonly router=inject(Router);
 readonly busy=signal(false);readonly error=signal('');
 readonly form=this.fb.nonNullable.group({username:['',[Validators.required,Validators.pattern(/^[a-zA-Z0-9][a-zA-Z0-9._-]{2,39}$/),Validators.maxLength(40)]],password:['',[Validators.required,Validators.maxLength(128)]]});
 async submit(){if(this.form.invalid){this.form.markAllAsTouched();return;}this.busy.set(true);this.error.set('');try{const v=this.form.getRawValue();await this.session.login(v.username,v.password);this.form.controls.password.reset();await this.router.navigateByUrl('/');}catch(e){this.error.set(errorMessage(e));}finally{this.busy.set(false);}}
}
