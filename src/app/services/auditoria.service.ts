import { Injectable, inject } from '@angular/core';
import { BASE_URL } from '../config';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {
  http = inject(HttpClient);
  router = inject(Router);



  search(page: number,
    pageSize: number,
    fechaDesde:any,
    fechaHasta:any,
      searchterm: string) {

    return this.http
      .get(BASE_URL + `/auditorias/${page}/${pageSize}/${fechaDesde}/${fechaHasta}/${searchterm}`)
      .pipe(
        map((respo: any) => {
          return respo as any;
        })
      );
  }


  eliminar(id: number) {

    return this.http.delete(BASE_URL + `/auditorias/${id}`)
      .pipe(
        map((respo: any) => {
          return respo as any;
        })
      );
  }


}
