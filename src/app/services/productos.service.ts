import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { BASE_URL } from '../config';
import { ProductoPage } from '../interfaces/productoItem.inteface';
import { PageProductosSimple, Producto } from '../interfaces/productos.interface';
import Swal from 'sweetalert2';
import { Variante } from '../interfaces/facturas.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  http = inject(HttpClient);
  router = inject(Router);
  getById(id:number) {
    return this.http
      .get(BASE_URL + "/productos/"+id)
      .pipe(map((resp: any) => resp));
  }

  findAll() {
    return this.http
      .get(BASE_URL + "/productos/")
      .pipe(
        map((respo: any) => {
          return respo;
        })
      );
  }

  searchProductoPage(sucursalId: number,listaPrecioId: number,page: number, size: number,marcaId:number,categoriaId:number,subCategoriaId:number, term: string) {
    return this.http
      .get(BASE_URL + "/productos/paginados/"+ sucursalId + "/" + listaPrecioId + "/" + page + "/" + size + "/"+marcaId +"/"+ categoriaId+"/"+ subCategoriaId+"/"+ term)
      .pipe(
        map((respo: any) => {
          return respo as ProductoPage;
        })
      );
  }

  searchSimple( page: number, size: number,  term: string) {
    return this.http
      .get(BASE_URL + "/productos/paginados/simple/"+ page + "/" + size + "/"+ term)
      .pipe(
        map((respo: any) => {
          return respo as PageProductosSimple;
        })
      );

  }


  create(producto: any): Observable<any> {
    console.log(producto);
    return this.http.post(BASE_URL + '/productos', producto)
      .pipe(
        map((response: any) => response ),
        catchError(e => {

          console.error('ERROR', e.error);
          Swal.fire(e.error.header, e.error.error, 'error');
         return throwError(() => e.error.error);
        })
      );
  }



  update(producto: Producto): Observable<any> {
    console.log(producto);
    return this.http.put(BASE_URL + '/productos/'+producto.id, producto)
      .pipe(
        map((response: any) => response ),
        catchError(e => {

          console.error('ERROR', e.error);
          Swal.fire(e.error.header, e.error.error, 'error');
         return throwError(() => e.error.error);
        })
      );
  }


/************************Marca ***********************************/
findAllMarcas() {
  return this.http
    .get(BASE_URL + "/marcas/")
    .pipe(
      map((respo: any) => {
        return respo;
      })
    );
}
/************************Categorias***********************************/
findAllCategorias() {
  return this.http
    .get(BASE_URL + "/categorias/")
    .pipe(
      map((respo: any) => {
        return respo;
      })
    );
}
/************************subCategorias***********************************/
findAllSubCategorias() {
  return this.http
    .get(BASE_URL + "/subcategorias/")
    .pipe(
      map((respo: any) => {
        return respo;
      })
    );
}

/************************Variantes ***********************************/
findAllDescripcion(  ) {
  return this.http
    .get(BASE_URL + "/variantes/descripcion/" )
    .pipe(
      map((respo: any) => {
        return respo ;
      }),
      catchError(e => {
        console.error('ERROR', e.error); ;
       return of({});
      })
    );
}


findAllDesc( page: number, size: number,  term: string) {
  return this.http
    .get(BASE_URL + "/variantes/findAllDesc/"+ page + "/" + size + "/"+ term)
    .pipe(
      map((respo: any) => {
        return respo as PageProductosSimple;
      }),
      catchError(e => {
        console.error('ERROR', e.error); ;
       return of({});
      })
    );
}

findVariantesByProductoId(id:number) {
  return this.http
    .get(BASE_URL + "/variantes/producto/"+id)
    .pipe(
      map((respo: any) => {
        return respo;
      }),
      catchError(e => {
        console.error('ERROR', e.error); ;
       return of([]);
      })
    );
}
uploadImage(imagen:any, varianteId:any): Observable<any> {

  let formData: FormData = new FormData();
  formData.append('id', varianteId);
  formData.append('image', imagen);
  let url = BASE_URL + 'productos/upload-image';
  return this.http.post(url, formData).pipe(
   map((response: any) => {
      console.log(response)
      return response;
    }),
    catchError(e => {
      console.error('ERROR', e.error); ;
     return of(null);
    })
  )

}
createVariante(variante: Variante): Observable<any> {
  console.log(variante);
  return this.http.post(BASE_URL + '/variantes', variante)
    .pipe(
      map((response: any) => response ),
      catchError(e => {

        console.error('ERROR', e.error);
        Swal.fire(e.error.header, e.error.error, 'error');
       return throwError(() => e.error.error);
      })
    );
}



updateVariante(variante: Variante): Observable<any> {
  console.log(variante);
  return this.http.put(BASE_URL + '/variantes/'+variante.id, variante)
    .pipe(
      map((response: any) => response ),
      catchError(e => {

        console.error('ERROR', e.error);
        Swal.fire(e.error.header, e.error.error, 'error');
       return throwError(() => e.error.error);
      })
    );
}

/************************Variedad ***********************************/
findAllVariedades() {
  return this.http
    .get(BASE_URL + "/variedades/")
    .pipe(
      map((respo: any) => {
        return respo;
      }),
      catchError(e => {
        console.error('ERROR', e.error); ;
       return of([]);
      })
    );
}
/************************presentaciones***********************************/
findAllPresentaciones() {
  return this.http
    .get(BASE_URL + "/presentaciones/")
    .pipe(
      map((respo: any) => {
        return respo;
      }),
      catchError(e => {
        console.error('ERROR', e.error); ;
       return of([]);
      })
    );
}
/************************subCategorias***********************************/
findAllUnidades() {
  return this.http
    .get(BASE_URL + "/unidades/")
    .pipe(
      map((respo: any) => {
        return respo;
      }),
      catchError(e => {
        console.error('ERROR', e.error); ;
       return of([]);
      })
    );
}


}
