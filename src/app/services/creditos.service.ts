import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { BASE_URL } from "../config";
import {  map, catchError } from "rxjs/operators";
import Swal from "sweetalert2";
import { Observable, throwError } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class CreditosService {
  http = inject(HttpClient);
  router = inject(Router);

  getWidget(fechaInicio:any,fechaFin:any) {
    return this.http
      .get(BASE_URL + "/creditos/widget/"+fechaInicio+'/'+fechaFin)
      .pipe(map((resp: any) => resp));
  }
  getHistorial(creditoId:any ) {
    return this.http
      .get(BASE_URL + "/creditos/historial/"+creditoId)
      .pipe(map((resp: any) => resp));
  }

  getPaginado(page:any,size:any,fechaInicio:any,fechaFin:any,clienteId:any,nroComprobante:any,estado:string ) {
const estadoParam =(estado == 'TODOS')?null:estado;
    return this.http
      .get(BASE_URL + "/creditos/buscar/paginado/"+page+'/'+size+'/'+fechaInicio+'/'+fechaFin+'/'+clienteId+'/'+nroComprobante+'/'+estadoParam )
      .pipe(map((resp: any) => resp));
  }
  getLista(fechaInicio:any,fechaFin:any,clienteId:any,nroComprobante:any,estado:string,diasMora:any) {
    return this.http
      .get(BASE_URL + "/creditos/buscar/lista/"+fechaInicio+'/'+fechaFin+'/'+clienteId+'/'+nroComprobante+'/'+estado+'/'+diasMora)
      .pipe(map((resp: any) => resp));
  }

pagar(creditoId: any): Observable<any> {
   return this.http.post(BASE_URL + '/creditos/pagar/'+creditoId, null)
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
