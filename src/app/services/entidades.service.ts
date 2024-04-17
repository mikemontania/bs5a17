import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { BASE_URL } from "../config";
import {  map, catchError } from "rxjs/operators";
import Swal from "sweetalert2";
import { Observable, throwError } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class EntidadesService {
  http = inject(HttpClient);
  router = inject(Router);



  findAll(tipo: string) {
    return this.http
      .get(BASE_URL + "/" + tipo )
      .pipe(
        map((respo: any) => {
          return respo;
        })
      );
  }


  create(tipo: string,entidad: any): Observable<any> {
    console.log(entidad);
    return this.http.post(BASE_URL + '/'+tipo, entidad)
      .pipe(
        map((response: any) => response ),
        catchError(e => {

          console.error('ERROR', e.error);
          Swal.fire(e.error.header, e.error.error, 'error');
         return throwError(() => e.error.error);
        })
      );
  }



  update(tipo: string,entidad: any): Observable<any> {
    console.log(entidad);
    return this.http.put(BASE_URL + '/'+tipo+"/"+entidad.id, entidad)
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
