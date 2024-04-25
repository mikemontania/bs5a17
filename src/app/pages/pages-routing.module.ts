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
import { AuditoriasComponent } from './auditorias/auditorias.component';

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
        path: "empresa",
        canActivate: [authGuard],

        component: EmpresaComponent
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
        path: "auditorias",
        canActivate: [authGuard],
        component: AuditoriasComponent
      },

      {
        path: "productos/variantes/:id",
        canActivate: [authGuard],

        component: VarianteComponent
      },
      {
        path: "productos/producto/:id",
        canActivate: [authGuard],

        component: ProductoComponent
      },
      {
        path: "productos/producto",
        canActivate: [authGuard],

        component: ProductoComponent
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
        path: "numeraciones",
        canActivate: [authGuard],

        component: NumeracionesComponent
      },
      {
        path: "numeraciones/numeracion/:id",
        canActivate: [authGuard],

        component: NumeracionComponent
      },
      {
        path: "numeraciones/numeracion",
        canActivate: [authGuard],

        component: NumeracionComponent
      },

      {
        path: "sucursales",
        canActivate: [authGuard],

        component: SucursalesComponent
      },
      {
        path: "sucursales/sucursal/:id",
        canActivate: [authGuard],

        component: SucursalComponent
      },
      {
        path: "sucursales/sucursal",
        canActivate: [authGuard],

        component: SucursalComponent
      },
      {
        path: "usuarios",
        canActivate: [authGuard],

        component: UsuariosComponent
      },
      {
        path: "usuarios/usuario/:id",
        canActivate: [authGuard],

        component: UsuarioComponent
      },
      {
        path: "usuarios/usuario",
        canActivate: [authGuard],

        component: UsuarioComponent
      },

      {
        path: "valoraciones/:registro/:tipo",
        canActivate: [authGuard],

        component: ValoracionComponent
      },
      { path: "**", redirectTo: "dashboard" }
    ]
  }
] as Route[];
