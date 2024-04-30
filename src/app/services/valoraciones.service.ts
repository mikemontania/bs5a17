import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { BASE_URL } from "../config";
import {   catchError, map } from "rxjs/operators";
import { Observable, of, throwError } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ValoracionService {
  http = inject(HttpClient);
  router = inject(Router);
  obtenerDescuentoImporte(  listaPrecioId: number,sucursalId: number) {
    return this.http
      .get(BASE_URL + "/valoraciones/descuentoescala/" + listaPrecioId + "/" + sucursalId )
      .pipe(
        map((respo: any) => {
          return respo;
        })  ,
        catchError(e => {
          console.error('ERROR', e.error); ;
         return of([]);
        })
      );
  }
 obtenerVigente(id: number, sucursalId: number, listaPrecioId: number) {
    return this.http
      .get(BASE_URL + "/valoraciones/vigente/" + id + "/" + sucursalId + "/" + listaPrecioId)
      .pipe(
        map((respo: any) => {
          return respo;
        })  ,
        catchError(e => {
          console.error('ERROR', e.error); ;
         return of([]);
        })
      );
  }
  obtenerValoraciones(fechaDesde: string,   registro: string,tipo:string, sucursalId:number,listaPrecioId:number) {
    const parametroReg = (registro == '')?'xxxxxx':registro;
    const parametroTip = (tipo == '')?'xxxxxx':tipo;

    return this.http
      .get(BASE_URL + "/valoraciones/findall/" + fechaDesde + "/" +   parametroReg+ "/" + parametroTip+ "/" + sucursalId + "/" +listaPrecioId)
      .pipe(
        map((respo: any) => {
          return respo;
        }),
        catchError(e => {
          console.error('ERROR', e.error); ;
         return of([]);
        })
      );
  }


  create(valoracion: any): Observable<any> {
    console.log(valoracion);
    return this.http.post(BASE_URL + '/valoraciones', valoracion)
      .pipe(
        map((response: any) => response ),
        catchError(e => {

          console.error('ERROR', e.error);

         return throwError(() => e.error.error);
        })
      );
  }

  updateFields(body: any): Observable<any> {
    console.log(body);
    return this.http.put(BASE_URL + '/valoraciones/updateFields', body)
      .pipe(
        map((response: any) => response ),
        catchError(e => {

          console.error('ERROR', e.error);

         return throwError(() => e.error.error);
        })
      );
  }



  update(valoracion: any): Observable<any> {
    console.log(valoracion);
    return this.http.put(BASE_URL + '/valoraciones/'+valoracion.id, valoracion)
      .pipe(
        map((response: any) => response ),
        catchError(e => {

          console.error('ERROR', e.error);
         return throwError(() => e.error.error);
        })
      );
  }


  deleteById(id: number): Observable<any> {
    console.log(id);
    return this.http.delete(BASE_URL + '/valoraciones/'+id)
      .pipe(
        map((response: any) => response ),
        catchError(e => {
          console.error('ERROR', e.error);
         return throwError(() => e.error.error);
        })
      );
  }


}
