import { Injectable, inject } from '@angular/core';
import { BASE_URL } from '../config';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {
  http = inject(HttpClient);
  router = inject(Router);

  getById(id:number) {
    return this.http
      .get(BASE_URL + "/documentos/"+id)
      .pipe(map((resp: any) => resp));
  }


  create(body:any) {
    return this.http
      .post(BASE_URL + "/documentos",body)
      .pipe(map((resp: any) => resp));
  }

  search(page: number,
    pageSize: number,
    fechaDesde:any,
    fechaHasta:any,
    clienteId:number,sucursalId: number,condicionPagoId:number,listaPrecioId: number, nroComprobante: string) {
      console.log(nroComprobante)
    return this.http
      .get(BASE_URL + `/documentos/${page}/${pageSize}/${fechaDesde}/${fechaHasta}/${clienteId}/${sucursalId}/${condicionPagoId}/${listaPrecioId}/${nroComprobante}`)
      .pipe(
        map((respo: any) => {
          return respo as any;
        })
      );
  }


  historialXml(id: number) {
    return this.http.get(BASE_URL + `/historiales/historialxml/${id}` )
      .pipe(
        map((respo: any) => {
          return respo as any;
        })
      );
  }


  anular(id: number) {

    return this.http.put(BASE_URL + `/documentos/anular/${id}`,null)
      .pipe(
        map((respo: any) => {
          return respo as any;
        })
      );
  }

  generaXml(documentoId: number) {
    return this.http.get(BASE_URL + `/documentos/generar-xml/${documentoId}`, { responseType: 'blob' })
      .pipe(
        map((respo: Blob) => {
          return respo;
        })
      );
  }

  firmarXML(id: number) {

    return this.http.get(BASE_URL + `/documentos/firmar-xml/${id}` )
      .pipe(
        map((respo: any) => {
          return respo as any;
        })
      );
  }


}
