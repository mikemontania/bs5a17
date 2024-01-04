import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(c => c.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/pages-routing.module'),
  },
];
