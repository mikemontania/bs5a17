import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { BASE_URL } from "../config";
import {   map  } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class TablaSifenService {
  http = inject(HttpClient);
  router = inject(Router);

  getById(id:number) {
    return this.http
      .get(BASE_URL + "/tablas-sifen"+id)
      .pipe(map((resp: any) => resp));
  }

  findAllrecords(tabla:string) {
    return this.http
      .get(BASE_URL + "/tablas-sifen/tabla/"+tabla)
      .pipe(
        map((respo: any) => {
          return respo;
        })
      );
  }
  getMonedas() {
    return this.http
      .get(BASE_URL + "/monedas")
      .pipe(
        map((respo: any) => {
          return respo;
        })
      );
  }
}
