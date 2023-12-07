import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations'

import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app/app.routes';


bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient()
]
})
  .catch(err => console.error(err));
