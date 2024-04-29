import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { BASE_URL } from "../config";
import {   map  } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class ListaPrecioService {
  http = inject(HttpClient);
  router = inject(Router);

  findPredeterminado( ) {
    return this.http
      .get(BASE_URL + "/lista-precio/predeterminado")
      .pipe(map((resp: any) => resp));
  }

  getById(id:number) {
    return this.http
      .get(BASE_URL + "/lista-precio/"+id)
      .pipe(map((resp: any) => resp));
  }


  findAll() {
    return this.http
      .get(BASE_URL + "/lista-precio/")
      .pipe(
        map((respo: any) => {
          return respo;
        })
      );
  }
}
