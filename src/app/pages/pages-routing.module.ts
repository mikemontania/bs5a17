import { Route } from '@angular/router';
import { DashbardComponent } from './dashbard/dashbard.component';
import { PagesComponent } from './pages.component';
import { UsersComponent } from './users/users.component';
import { authGuard } from '../guards/auth-guard.guard';
import { ClienteComponent } from './cliente/cliente.component';

export default [
  {
    path: "",
    component: PagesComponent,
    children: [
      {
        path: "dashboard",
        canActivate: [authGuard],
        component: DashbardComponent
      },
      {
        path: "ventas",
        canActivate: [authGuard],
        loadChildren: () => import('./ventas/ventas-routing.module')
       },
       {
        path: "clientes",
        canActivate: [authGuard],
        component: ClienteComponent
      },
      {
        path: "user",
        canActivate: [authGuard],
        component: UsersComponent
      },
      { path: "**", redirectTo: "dashboard" }
    ]
  }
] as Route[];
