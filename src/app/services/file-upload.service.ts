import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { BASE_URL } from '../config';

// Define an interface for the expected server response
interface UploadResponse {
  ok: boolean;
  nombreArchivo?: string;
  msg?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private http: HttpClient) {}

  actualizarFoto(
    archivo: File,
    tipo: 'usuarios' | 'productos' | 'empresas',
    id: number
  ) {
    const formData = new FormData();
    formData.append('imagen', archivo);
    const url = `${BASE_URL}/uploads/${tipo}/${id}`;

    return this.http.put<UploadResponse>(url, formData)
      .pipe(
        map((resp:any) => {
          if (resp.ok) {
            return resp.nombreArchivo;
          } else {
            console.error(resp.msg); // Log specific error message
            return false;
          }
        }),
        catchError(error => {
          console.error('Upload error:', error);
          return of(false); // Return false on error
        })
      );
  }
}
