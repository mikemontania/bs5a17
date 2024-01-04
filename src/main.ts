import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations'

import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app/app.routes';
import { interceptorServ } from './app/interceptor/interceptor.interceptor';
import { ServiceModule } from './app/services/service.module';


bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideRouter(routes),
     provideHttpClient(withInterceptors([interceptorServ])),
    ServiceModule
]
})
  .catch(err => console.error(err));
