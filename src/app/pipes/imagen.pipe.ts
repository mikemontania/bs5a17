import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { catchError, map } from 'rxjs/operators';
import { BASE_URL } from '../config';
import { Observable, of } from 'rxjs';

@Pipe({
  standalone: true,
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  transform(img: string, tipo: string): Observable<SafeUrl> {
    const url = BASE_URL + "/uploads/" + tipo + '/' + img;

    return this.http.get(url, { responseType: 'blob' })
      .pipe(
        map(val => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(val))),
        catchError(() => {
           const defaultImageUrl = '../../assets/img/sin-imagen.jpg';
          return of(this.sanitizer.bypassSecurityTrustUrl(defaultImageUrl));
        })
      );
  }
}
