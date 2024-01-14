import { Injectable, inject } from '@angular/core';
import { BASE_URL } from '../config';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  http = inject(HttpClient);
  router = inject(Router);

  getById(id:number) {
    return this.http
      .get(BASE_URL + "/ventas/"+id)
      .pipe(map((resp: any) => resp));
  }


  create(body:any) {
    return this.http
      .post(BASE_URL + "/ventas",body)
      .pipe(map((resp: any) => resp));
  }

  search(page: number,
    pageSize: number,
    fechaDesde:any,
    fechaHasta:any,
    clienteId:number,sucursalId: number,formaVentaId:number,listaPrecioId: number, nroComprobante: string) {
      console.log(nroComprobante)
    return this.http
      .get(BASE_URL + `/ventas/${page}/${pageSize}/${fechaDesde}/${fechaHasta}/${clienteId}/${sucursalId}/${formaVentaId}/${listaPrecioId}/${nroComprobante}`)
      .pipe(
        map((respo: any) => {
          return respo as any;
        })
      );
  }


  anular(id: number) {

    return this.http.put(BASE_URL + `/ventas/anular/${id}`,null)
      .pipe(
        map((respo: any) => {
          return respo as any;
        })
      );
  }


}
