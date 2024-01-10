import { Injectable, inject } from '@angular/core';
import { BASE_URL } from '../config';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  http = inject(HttpClient);
  router = inject(Router);

  create(body:any) {
    return this.http
      .post(BASE_URL + "/ventas",body)
      .pipe(map((resp: any) => resp));
  }
  constructor() { }
}
