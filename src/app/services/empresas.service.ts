import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { BASE_URL } from "../config";
import {  map, catchError } from "rxjs/operators";
import Swal from "sweetalert2";
import { Observable, throwError } from "rxjs";
import { Empresa } from "../interfaces/facturas.interface";

@Injectable({
  providedIn: "root"
})
export class EmpresaService {
  http = inject(HttpClient);
  router = inject(Router);

  getById(id:number) {
    return this.http
      .get(BASE_URL + "/empresas/"+id)
      .pipe(map((resp: any) => resp));
  }

  update(empresa: Empresa): Observable<any> {
    console.log(empresa);
    return this.http.put(BASE_URL + '/empresas/'+empresa.id, empresa)
      .pipe(
        map((response: any) => response ),
        catchError(e => {

          console.error('ERROR', e.error);
          Swal.fire(e.error.header, e.error.error, 'error');
         return throwError(() => e.error.error);
        })
      );
  }


}
