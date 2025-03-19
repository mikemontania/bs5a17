import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { BASE_URL } from "../config";
import {  map } from "rxjs/operators";
@Injectable({
  providedIn: "root"
})
export class CondicionPagoService {
  http = inject(HttpClient);
  router = inject(Router);

  getById(id:number) {
    return this.http
      .get(BASE_URL + "/condicion-pago/"+id)
      .pipe(map((resp: any) => resp));
  }

  findAll() {
    return this.http
      .get(BASE_URL + "/condicion-pago/")
      .pipe(
        map((respo: any) => {
          return respo;
        })
      );
  }

  findPredeterminado() {
    return this.http
      .get(BASE_URL + "/condicion-pago/predeterminado")
      .pipe(map((resp: any) => resp));
  }



}
