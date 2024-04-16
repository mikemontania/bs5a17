import { Route } from '@angular/router';
import { DashbardComponent } from './dashbard/dashbard.component';
import { PagesComponent } from './pages.component';
import { authGuard } from '../guards/auth-guard.guard';
import { ClienteComponent } from './cliente/cliente/cliente.component';
import { ClientesComponent } from './cliente/clientes/clientes.component';
import { ProductoComponent } from './producto/producto/producto.component';
import { ProductosComponent } from './producto/productos/productos.component';
import { VarianteComponent } from './producto/variante/variante.component';
import { ValoracionComponent } from './valoracion/valoracion.component';
import { NumeracionComponent } from './numeracion/numeracion/numeracion.component';
import { NumeracionesComponent } from './numeracion/numeraciones/numeraciones.component';
import { UsuariosComponent } from './usuario/usuarios/usuarios.component';
import { UsuarioComponent } from './usuario/usuario/usuario.component';
import { EmpresaComponent } from './empresa/empresa.component';
import { SucursalesComponent } from './sucursal/sucursales/sucursales.component';
import { SucursalComponent } from './sucursal/sucursal/sucursal.component';
import { roleGuard } from '../guards/role-guard.guard';

export default [
  {
    path: "",
    component: PagesComponent,
    children: [
      {
        path: "dashboard",
        canActivate: [authGuard],
        canMatch:[roleGuard],
        component: DashbardComponent
      },
      {
        path: "empresa",
        canActivate: [authGuard],
        canMatch:[roleGuard],
        component: EmpresaComponent
      },
      {
        path: "ventas",
        canActivate: [authGuard],
        canMatch:[roleGuard],
        loadChildren: () => import('./ventas/ventas-routing.module')
       },
       {
        path: "productos",
        canActivate: [authGuard],
        canMatch:[roleGuard],
        component: ProductosComponent
      },
      {
        path: "productos/variantes/:id",
        canActivate: [authGuard],
        canMatch:[roleGuard],
        component: VarianteComponent
      },
      {
        path: "productos/producto/:id",
        canActivate: [authGuard],
        canMatch:[roleGuard],
        component: ProductoComponent
      },
      {
        path: "productos/producto",
        canActivate: [authGuard],
        canMatch:[roleGuard],
        component: ProductoComponent
      },
       {
        path: "clientes",
        canActivate: [authGuard],
        canMatch:[roleGuard],
        component: ClientesComponent
      },
      {
        path: "clientes/cliente/:id",
        canActivate: [authGuard],
        canMatch:[roleGuard],
        component: ClienteComponent
      },
      {
        path: "clientes/cliente",
        canActivate: [authGuard],
        canMatch:[roleGuard],
        component: ClienteComponent
      },
      {
        path: "numeraciones",
        canActivate: [authGuard],
        canMatch:[roleGuard],
        component: NumeracionesComponent
      },
      {
        path: "numeraciones/numeracion/:id",
        canActivate: [authGuard],
        canMatch:[roleGuard],
        component: NumeracionComponent
      },
      {
        path: "numeraciones/numeracion",
        canActivate: [authGuard],
        canMatch:[roleGuard],
        component: NumeracionComponent
      },

      {
        path: "sucursales",
        canActivate: [authGuard],
        canMatch:[roleGuard],
        component: SucursalesComponent
      },
      {
        path: "sucursales/sucursal/:id",
        canActivate: [authGuard],
        canMatch:[roleGuard],
        component: SucursalComponent
      },
      {
        path: "sucursales/sucursal",
        canActivate: [authGuard],
        canMatch:[roleGuard],
        component: SucursalComponent
      },
      {
        path: "usuarios",
        canActivate: [authGuard],
        canMatch:[roleGuard],
        component: UsuariosComponent
      },
      {
        path: "usuarios/usuario/:id",
        canActivate: [authGuard],
        canMatch:[roleGuard],
        component: UsuarioComponent
      },
      {
        path: "usuarios/usuario",
        canActivate: [authGuard],
        canMatch:[roleGuard],
        component: UsuarioComponent
      },

      {
        path: "valoraciones/:registro/:tipo",
        canActivate: [authGuard],
        canMatch:[roleGuard],
        component: ValoracionComponent
      },
      { path: "**", redirectTo: "dashboard" }
    ]
  }
] as Route[];
