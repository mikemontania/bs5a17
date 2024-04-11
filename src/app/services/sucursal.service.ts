import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { BASE_URL } from "../config";
import {   catchError, map  } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import Swal from "sweetalert2";
import { Sucursal } from "../interfaces/sucursal.interface";

@Injectable({
  providedIn: "root"
})
export class SucursalService {
  http = inject(HttpClient);
  router = inject(Router);

  getById(id:number) {
    return this.http
      .get(BASE_URL + "/sucursales/"+id)
      .pipe(map((resp: any) => resp));
  }
  findAll() {
    return this.http
      .get(BASE_URL + "/sucursales/")
      .pipe(
        map((respo: any) => {
          return respo;
        })
      );
  }




  create(sucursal: any): Observable<any> {
    console.log(sucursal);
    return this.http.post(BASE_URL + '/sucursales', sucursal)
      .pipe(
        map((response: any) => response ),
        catchError(e => {

          console.error('ERROR', e.error);
          Swal.fire(e.error.header, e.error.error, 'error');
         return throwError(() => e.error.error);
        })
      );
  }



  update(sucursal: Sucursal): Observable<any> {
    console.log(sucursal);
    return this.http.put(BASE_URL + '/sucursales/'+sucursal.id, sucursal)
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
