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

  getActividades() {
    return this.http
      .get(BASE_URL + "/empresas/actividades")
      .pipe(map((resp: any) => resp));
  }

  addActividad(actividad:any) {
    return this.http
      .post(BASE_URL + "/empresas/add-actividades", actividad)
      .pipe(map((resp: any) => resp));
  }

  quitarActividad(id:number) {
    return this.http
      .delete(BASE_URL + "/empresas/remove-actividad/"+ id)
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


/*************Certificado******** */
getCertificado() {
  console.log(BASE_URL + "/certificados/")
  return this.http
    .get(BASE_URL + "/certificados/get")
    .pipe(map((resp: any) => resp));
}

createCertificado(certificado:any) {
  return this.http
    .post(BASE_URL + "/certificados/create", certificado)
    .pipe(map((resp: any) => resp));
}

updateCertificado(certificado: any): Observable<any> {
  console.log(certificado);
  return this.http.put(BASE_URL + '/certificados/update/'+certificado.id, certificado)
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
