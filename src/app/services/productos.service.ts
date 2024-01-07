import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { BASE_URL } from '../config';
import { ProductoPage } from '../interfaces/productoItem.inteface';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  http = inject(HttpClient);
  router = inject(Router);

  searchProductoPage(sucursalId: number,listaPrecioId: number,page: number, size: number,marcaId:number,categoriaId:number,subCategoriaId:number, term: string) {
    return this.http
      .get(BASE_URL + "/productos/paginados/"+ sucursalId + "/" + listaPrecioId + "/" + page + "/" + size + "/"+marcaId +"/"+ categoriaId+"/"+ subCategoriaId+"/"+ term)
      .pipe(
        map((respo: any) => {
          return respo as ProductoPage;
        })
      );
  }
}
