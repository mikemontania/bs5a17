import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { BASE_URL } from "../config";
import { tap, map, catchError } from "rxjs/operators";
import Swal from "sweetalert2";
import { Observable, throwError } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class FormaVentaService {
  http = inject(HttpClient);
  router = inject(Router);

  getById(id:number) {
    return this.http
      .get(BASE_URL + "/forma-venta/"+id)
      .pipe(map((resp: any) => resp));
  }

  findAll() {
    return this.http
      .get(BASE_URL + "/forma-venta/")
      .pipe(
        map((respo: any) => {
          return respo;
        })
      );
  }

  findPredeterminado() {
    return this.http
      .get(BASE_URL + "/forma-venta/predeterminado")
      .pipe(map((resp: any) => resp));
  }



}
