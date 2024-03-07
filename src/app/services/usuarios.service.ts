import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { map, Observable, catchError, throwError } from "rxjs";
import Swal from "sweetalert2";
import { BASE_URL } from "../config";
import { Usuario } from "../interfaces/usuario.interface";


@Injectable({
  providedIn: "root"
})
export class UsuariosService {
  http = inject(HttpClient);
  router = inject(Router);

  getById(id:number) {
    return this.http
      .get(BASE_URL + "/usuarios/"+id)
      .pipe(map((resp: any) => resp));
  }


  search(page: number, size: number, term: string) {
    return this.http
      .get(BASE_URL + "/usuarios/paginados/" + page + "/" + size + "/" + term)
      .pipe(
        map((respo: any) => {
          return respo;
        })
      );
  }



  create(usuario: Usuario): Observable<any> {
    console.log(usuario);
    return this.http.post(BASE_URL + '/usuarios', usuario)
      .pipe(
        map((response: any) => response ),
        catchError(e => {

          console.error('ERROR', e.error);
          Swal.fire(e.error.header, e.error.error, 'error');
         return throwError(() => e.error.error);
        })
      );
  }



  update(usuario: Usuario): Observable<any> {
    console.log(usuario);
    return this.http.put(BASE_URL + '/usuarios/'+usuario.id, usuario)
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
