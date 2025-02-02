import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { BASE_URL } from "../config";
import {   map  } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class EstablecimientoService {
  http = inject(HttpClient);
  router = inject(Router);

  getDepartamentos() {
    return this.http
      .get(BASE_URL + "/departamentos")
      .pipe(map((resp: any) => resp));
  }

  getCiudades(codDepartamento:number) {
    return this.http
      .get(BASE_URL + "/ciudades/dep/"+codDepartamento)
      .pipe(map((resp: any) => resp));
  }
  getBarrios(codCiudad:number) {
    return this.http
      .get(BASE_URL + "/barrios/ciud/"+codCiudad)
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
}
