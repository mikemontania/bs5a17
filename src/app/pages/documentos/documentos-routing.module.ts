import { Route } from '@angular/router';
import { authGuard } from '../../guards/auth-guard.guard';


export default [
  {
    path: "",
    canActivate: [authGuard],

    loadComponent: () => import('./documentos/documentos.component').then((c) => c.DocumentosComponent)
  },
  {
    path: "nc/:id",
    canActivate: [authGuard],

    loadComponent: () => import('./documentoNc/documentoNc.component').then((c) => c.DocumentoNcComponent)
  },
  {
    path: "reporteCobranza",
    canActivate: [authGuard],

    loadComponent: () => import('./reporteCobranza/reporteCobranza.component').then((c) => c.ReporteCobranzaComponent)
  },
  {
    path: "creditos",
    canActivate: [authGuard],

    loadComponent: () => import('./creditos/creditos.component').then((c) => c.CreditoComponent)
  },
  {
    path: "listar",
    canActivate: [authGuard],

    loadComponent: () => import('./list/list.component').then((c) => c.ListComponent)
  },
  {
    path: "listarenvios",
    canActivate: [authGuard],
    loadComponent: () => import('./listEnvio/listEnvio.component').then((c) => c.ListEnvioComponent)
  },
  {
    path: "detalles/:id",
    canActivate: [authGuard],

    loadComponent: () => import('./detalle/detalle.component').then((c) => c.DetalleComponent)
  },

] as Route[];
