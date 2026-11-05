import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService, errorMessage } from '../core/session';
@Component({standalone:true,imports:[ReactiveFormsModule],styleUrl:'./login.component.css',template:`
<main class="login-page">
 <aside class="login-story" aria-label="Terrabus">
  <svg class="login-globe" viewBox="0 0 900 900" aria-hidden="true" focusable="false">
   <defs><clipPath id="login-globe-clip"><circle cx="450" cy="450" r="415" /></clipPath></defs>
   <g transform="rotate(-16 450 450)" clip-path="url(#login-globe-clip)">
    <circle cx="450" cy="450" r="415" class="globe-outline" />
    <g class="globe-grid"><ellipse cx="450" cy="450" rx="270" ry="415"/><ellipse cx="450" cy="450" rx="112" ry="415"/><path d="M35 450H865M75 275Q450 355 825 275M75 625Q450 545 825 625M190 125Q450 205 710 125M190 775Q450 695 710 775"/></g>
    <g class="globe-land"><path d="M95 220 145 161 211 144 254 112 304 120 330 155 386 155 430 194 405 224 365 225 349 253 368 276 347 310 323 326 311 367 281 383 278 421 253 427 246 394 224 374 200 336 168 325 161 290 132 272Z"/><path d="M276 423 307 432 322 464 353 478 384 486 405 512 451 521 481 553 469 587 443 605 435 648 407 681 396 726 369 776 345 804 330 773 335 735 322 693 314 652 298 615 291 568 268 540 257 502 266 467Z"/><path d="M465 151 493 125 541 113 562 134 546 171 510 184 484 179Z"/><path d="M570 242 614 204 661 207 681 231 719 228 760 254 785 291 830 302 850 347 815 371 775 353 754 381 723 364 701 337 668 346 639 326 620 294 588 292Z"/><path d="M599 347 642 339 672 362 686 404 722 432 704 470 680 478 673 520 647 554 616 542 605 503 580 476 566 435 574 393Z"/></g>
   </g>
   <circle cx="450" cy="450" r="415" class="globe-outline" />
  </svg>
  <svg class="login-waves" viewBox="0 0 850 400" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path class="wave-back" d="M0 20C190 95 285 257 535 317S760 355 850 400H0Z"/><path class="wave-front" d="M0 197C203 232 293 325 466 400H0Z"/><path class="wave-line" d="M0 197C203 232 293 325 466 400"/></svg>
  @if(logoUrl){<img class="login-logo" [src]="logoUrl" alt="Terrabus" width="236" height="244" fetchpriority="high">}
 </aside>
 <section class="login-form-wrap"><div class="login-form">
  <p class="eyebrow">BIENVENIDO A TALLERBUS</p><h1>Inicia sesión</h1><p class="muted">Usa la cuenta que te proporcionó Administración.</p>
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
 // Se activará al incorporar el archivo original del logotipo, sin recrearlo.
 readonly logoUrl:string|null=null;
 private readonly fb=inject(FormBuilder);private readonly session=inject(SessionService);private readonly router=inject(Router);
 readonly busy=signal(false);readonly error=signal('');
 readonly form=this.fb.nonNullable.group({username:['',[Validators.required,Validators.pattern(/^[a-zA-Z0-9][a-zA-Z0-9._-]{2,39}$/),Validators.maxLength(40)]],password:['',[Validators.required,Validators.maxLength(128)]]});
 async submit(){if(this.form.invalid){this.form.markAllAsTouched();return;}this.busy.set(true);this.error.set('');try{const v=this.form.getRawValue();await this.session.login(v.username,v.password);this.form.controls.password.reset();await this.router.navigateByUrl('/');}catch(e){this.error.set(errorMessage(e));}finally{this.busy.set(false);}}
}
