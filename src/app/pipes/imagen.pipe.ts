import { Pipe, PipeTransform } from '@angular/core';
 import {   HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable, map } from 'rxjs';
import { BASE_URL } from '../config';

@Pipe({
  standalone:true,
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  constructor(
    public http: HttpClient,
    private sanitizer: DomSanitizer
   ) {
  }
  transform( img: string, tipo: string): Observable<SafeUrl> {
    let url = BASE_URL + "/uploads/"+tipo + '/' + img;

      return this.http.get(url, {  responseType: 'blob'})
       .pipe(map(val => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(val))));
  }

}
