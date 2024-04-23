import { Route } from '@angular/router';
import { authGuard } from '../../guards/auth-guard.guard';


export default [
      {
        path: "",
        canActivate: [authGuard],

        loadComponent: () => import('./ventas/ventas.component').then((c) => c.VentasComponent)
      },
      {
        path: "reporteCobranza",
        canActivate: [authGuard],

        loadComponent: () => import('./reporteCobranza/reporteCobranza.component').then((c) => c.ReporteCobranzaComponent)
      },
      {
        path: "listar",
        canActivate: [authGuard],

        loadComponent: () => import('./list/list.component').then((c) => c.ListComponent)
      },
      {
        path: "detalles/:id",
        canActivate: [authGuard],

        loadComponent: () => import('./detalle/detalle.component').then((c) => c.DetalleComponent)
      },

] as Route[];
