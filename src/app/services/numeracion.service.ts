import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { BASE_URL } from "../config";
import {  map  } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class NumeracionService {
  http = inject(HttpClient);
  router = inject(Router);

  getById(id:number) {
    return this.http
      .get(BASE_URL + "/numeraciones/"+id)
      .pipe(map((resp: any) => resp));
  }
  findAll(sucursalId:number) {

    return this.http
      .get(BASE_URL + "/numeraciones/list/"+sucursalId)
      .pipe(
        map((respo: any) => {
          return respo;
        })
      );
  }

}
