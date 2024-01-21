import { Route } from '@angular/router';
import { DashbardComponent } from './dashbard/dashbard.component';
import { PagesComponent } from './pages.component';
import { UsersComponent } from './users/users.component';
import { authGuard } from '../guards/auth-guard.guard';
import { ClienteComponent } from './cliente/cliente/cliente.component';
import { ClientesComponent } from './cliente/clientes/clientes.component';
import { ProductosComponent } from './productos/productos.component';

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
        path: "productos",
        canActivate: [authGuard],
        component: ProductosComponent
      },
       {
        path: "clientes",
        canActivate: [authGuard],
        component: ClientesComponent
      },
      {
        path: "clientes/cliente/:id",
        canActivate: [authGuard],
        component: ClienteComponent
      },
      {
        path: "clientes/cliente",
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
