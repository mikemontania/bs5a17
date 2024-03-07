import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { BASE_URL } from "../config";
import {  map, catchError } from "rxjs/operators";
import Swal from "sweetalert2";
import { Observable, throwError } from "rxjs";
import { Cliente } from "../interfaces/clientes.interface";

@Injectable({
  providedIn: "root"
})
export class ClientesService {
  http = inject(HttpClient);
  router = inject(Router);

  getById(id:number) {
    return this.http
      .get(BASE_URL + "/clientes/"+id)
      .pipe(map((resp: any) => resp));
  }


  search(page: number, size: number, term: string) {
    return this.http
      .get(BASE_URL + "/clientes/paginados/" + page + "/" + size + "/" + term)
      .pipe(
        map((respo: any) => {
          return respo;
        })
      );
  }

  findPredeterminado() {
    return this.http
      .get(BASE_URL + "/clientes/predeterminado")
      .pipe(map((resp: any) => resp));
  }

  findPropietario() {
    return this.http
      .get(BASE_URL + "/clientes/propietario")
      .pipe(map((resp: any) => resp));
  }




  create(cliente: any): Observable<any> {
    console.log(cliente);
    return this.http.post(BASE_URL + '/clientes', cliente)
      .pipe(
        map((response: any) => response ),
        catchError(e => {

          console.error('ERROR', e.error);
          Swal.fire(e.error.header, e.error.error, 'error');
         return throwError(() => e.error.error);
        })
      );
  }



  update(cliente: Cliente): Observable<any> {
    console.log(cliente);
    return this.http.put(BASE_URL + '/clientes/'+cliente.id, cliente)
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
