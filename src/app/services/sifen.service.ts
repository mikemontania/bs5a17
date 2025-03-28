import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { BASE_URL } from "../config";
import {   catchError, map  } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root"
})
export class SifenService {
  http = inject(HttpClient);
  router = inject(Router);

  consultaCDC(id:number,cdc:string) {
    return this.http
      .get(BASE_URL + "/sifens/cdc/"+id+"/"+cdc)
      .pipe(map((resp: any) => resp));
  }

  anulacionSifen(id: number, tipoAnulacion:number): Observable<any> {
     return this.http.put(BASE_URL + '/sifens/anular/'+ id+'/'+tipoAnulacion, null)
      .pipe(
        map((response: any) => response ),
        catchError(e => {

          console.error('ERROR', e.error);
          Swal.fire(e.error.header, e.error.error, 'error');
         return throwError(() => e.error.error);
        })
      );
  }

  getKude(id: number ) {
    const url = BASE_URL + "/sifens/kude/" + id;

    return this.http
     .get(url, { responseType: 'blob' })
     .pipe(
      map((response: any) => {
        return new Blob([response], { type: 'application/pdf' });
      })
     );
    }


 sendKude(id: number ) {
    const url = BASE_URL + "/sifens/sendKude/" + id;

    return this.http
     .get(url )
     .pipe(
      map((response: any) => response ),
      catchError(e => {

        console.error('ERROR', e.error);
        Swal.fire(e.error.header, e.error.error, 'error');
       return throwError(() => e.error.error);
      })
    );
}
  reintentarSifen(id: number): Observable<any> {
    return this.http.post(BASE_URL + '/sifens/reintentar/'+ id, null)
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
