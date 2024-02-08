import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { BASE_URL } from "../config";
import {   catchError, map } from "rxjs/operators";
import { of } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ValoracionService {
  http = inject(HttpClient);
  router = inject(Router);

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



}
