import { Route } from '@angular/router';
import { authGuard } from '../../guards/auth-guard.guard';
import { roleGuard } from '../../guards/role-guard.guard';


export default [
      {
        path: "",
        canActivate: [authGuard],
        canMatch:[roleGuard],
        loadComponent: () => import('./ventas/ventas.component').then((c) => c.VentasComponent)
      },
      {
        path: "reporteCobranza",
        canActivate: [authGuard],
        canMatch:[roleGuard],
        loadComponent: () => import('./reporteCobranza/reporteCobranza.component').then((c) => c.ReporteCobranzaComponent)
      },
      {
        path: "listar",
        canActivate: [authGuard],
        canMatch:[roleGuard],
        loadComponent: () => import('./list/list.component').then((c) => c.ListComponent)
      },
      {
        path: "detalles/:id",
        canActivate: [authGuard],
        canMatch:[roleGuard],
        loadComponent: () => import('./detalle/detalle.component').then((c) => c.DetalleComponent)
      },

] as Route[];
