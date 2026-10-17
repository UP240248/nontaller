import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/routes';
import { sessionInterceptor } from './app/core/session';
bootstrapApplication(AppComponent,{providers:[provideHttpClient(withInterceptors([sessionInterceptor])),provideRouter(routes)]}).catch(()=>console.error('No se pudo iniciar TallerBus'));
