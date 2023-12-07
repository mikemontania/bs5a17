import { Routes } from '@angular/router';
import { isAuthenticatedGuard } from './auth/guards/is-authenticated.guard';
import { isNotAuthenticatedGuard } from './auth/guards/is-not-authenticated.guard';

export const routes: Routes = [


  {
    path: 'login',
    canActivate: [ isNotAuthenticatedGuard ],
    loadComponent: () => import('./auth/login/login.component').then(c=>c.LoginComponent),
  },
  {
    path: '',
    canActivate: [ isAuthenticatedGuard ],
    loadChildren: () => import('./pages/pages-routing.module'),
  },
  {
    path: '**',
    redirectTo: 'login'
  },


];
