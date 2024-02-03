import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { map } from "rxjs";
import { BASE_URL } from "../config";

@Injectable({
 providedIn: "root"
})
export class ReportesService {
 http = inject(HttpClient);
 router = inject(Router);

 getPdf(id: number ) {
  const url = BASE_URL + "/reportes/" + id;

  return this.http
   .get(url, { responseType: 'blob' })
   .pipe(
    map((response: any) => {
      return new Blob([response], { type: 'application/pdf' });

    })
   );
  }

  getReportCobranza(fechaDesde: string, fechaHasta: string, sucursalId: number, medioPagoId: number) {
    const url = BASE_URL + `/reportes/reportecobranza/${fechaDesde}/${fechaHasta}/${sucursalId}/${medioPagoId}`;
    return this.http
      .get(url)
      .pipe(
        map((response: any) => response)
      );
  }

  getReporteVentasPorSucursal(fechaDesde: string, fechaHasta: string, sucursalId: number, medioPagoId: number) {
    const url = BASE_URL + `/reportes/ventasPorSucursal/${fechaDesde}/${fechaHasta}/${sucursalId}/${medioPagoId}`;
    return this.http
      .get(url)
      .pipe(
        map((response: any) => response)
      );
  }

  getTopVariantes(fechaDesde: string, fechaHasta: string, sucursalId: number, medioPagoId: number) {
    const url = BASE_URL + `/reportes/topVariantes/${fechaDesde}/${fechaHasta}/${sucursalId}/${medioPagoId}`;
    return this.http
      .get(url)
      .pipe(
        map((response: any) => response)
      );
  }


  getTopClientes(fechaDesde: string, fechaHasta: string, sucursalId: number, medioPagoId: number) {
    const url = BASE_URL + `/reportes/topClientes/${fechaDesde}/${fechaHasta}/${sucursalId}/${medioPagoId}`;
    return this.http
      .get(url)
      .pipe(
        map((response: any) => response)
      );
  }


  getInformeMediosDePago(fechaDesde: string, fechaHasta: string, sucursalId: number, medioPagoId: number) {
    const url = BASE_URL + `/reportes/topMediosDePago/${fechaDesde}/${fechaHasta}/${sucursalId}/${medioPagoId}`;
    return this.http
      .get(url)
      .pipe(
        map((response: any) => response)
      );
  }


  getVendedoresPorTotal(fechaDesde: string, fechaHasta: string, sucursalId: number, medioPagoId: number) {
    const url = BASE_URL + `/reportes/vendedoresPorTotal/${fechaDesde}/${fechaHasta}/${sucursalId}/${medioPagoId}`;
    return this.http
      .get(url)
      .pipe(
        map((response: any) => response)
      );
                }

}
