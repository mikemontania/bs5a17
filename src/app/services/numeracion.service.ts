import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { BASE_URL } from "../config";
import {  catchError, map  } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import Swal from "sweetalert2";
import { Numeracion } from "../interfaces/numeracion.interface";

@Injectable({
  providedIn: "root"
})
export class NumeracionService {
  http = inject(HttpClient);
  router = inject(Router);

  getById(id:number) {
    return this.http
      .get(BASE_URL + "/numeraciones/"+id)
      .pipe(map((resp: any) => resp));
  }



  findAll(sucursalId:number) {

    return this.http
      .get(BASE_URL + "/numeraciones/list/"+sucursalId)
      .pipe(
        map((respo: any) => {
          return respo;
        })
      );
  }
  paginado(page: number, size: number ) {
    return this.http
      .get(BASE_URL + "/numeraciones/paginados/" + page + "/" + size )
      .pipe(
        map((respo: any) => {
          return respo;
        })
      );
  }



  create(numeracion: Numeracion): Observable<any> {
    console.log(numeracion);
    return this.http.post(BASE_URL + '/numeraciones', numeracion)
      .pipe(
        map((response: any) => response ),
        catchError(e => {

          console.error('ERROR', e.error);
          Swal.fire(e.error.header, e.error.error, 'error');
         return throwError(() => e.error.error);
        })
      );
  }



  update(numeracion: Numeracion): Observable<any> {
    console.log(numeracion);
    return this.http.put(BASE_URL + '/numeraciones/'+numeracion.id, numeracion)
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
