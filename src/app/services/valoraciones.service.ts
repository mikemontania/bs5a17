import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { BASE_URL } from "../config";
import {   map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class ValoracionService {
  http = inject(HttpClient);
  router = inject(Router);

 obtenerVigente(id: number, sucursalId: number, listaPrecioId: number) {
    return this.http
      .get(BASE_URL + "/valoraciones/vigente/" + id + "/" + sucursalId + "/" + listaPrecioId)
      .pipe(
        map((respo: any) => {
          return respo;
        })
      );
  }




}
