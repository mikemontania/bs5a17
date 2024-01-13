import { Route } from '@angular/router';
import { DashbardComponent } from './dashbard/dashbard.component';
import { PagesComponent } from './pages.component';
import { UsersComponent } from './users/users.component';
import { authGuard } from '../guards/auth-guard.guard';

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
        path: "user",
        canActivate: [authGuard],
        component: UsersComponent
      },
      { path: "**", redirectTo: "dashboard" }
    ]
  }
] as Route[];
