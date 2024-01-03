import { NgModule } from "@angular/core";
import { Route } from "@angular/router";
import { PagesComponent } from "./pages.component";
import { DashbardComponent } from "./dashbard/dashbard.component";
import { UsersComponent } from "./users/users.component";
import { verifyTokenGuard } from "../guards/verify-token.guard";
import { VentasComponent } from "./ventas/ventas.component";

export default [
  {
    path: "",
    component: PagesComponent,
    children: [
      {
        path: "dashboard",
        canActivate: [verifyTokenGuard],
        component: DashbardComponent
      },
      {
        path: "ventas",
        canActivate: [verifyTokenGuard],
        loadComponent: ()=> import('./ventas/ventas.component').then((c)=>c.VentasComponent)
      },
      {
        path: "user",
        canActivate: [verifyTokenGuard],
        component: UsersComponent
      },
      { path: "**", redirectTo: "dashboard" }
    ]
  }
] as Route[];
