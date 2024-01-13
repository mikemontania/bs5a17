import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { map } from "rxjs";
import { BASE_URL } from "../config";

@Injectable({
 providedIn: "root"
})
export class ReportesService {
 http = inject(HttpClient);
 router = inject(Router);

 getPdf(id: number ) {
  const url = BASE_URL + "/reportes/" + id;

  return this.http
   .get(url, { responseType: 'blob' })
   .pipe(
    map((response: any) => {
      return new Blob([response], { type: 'application/pdf' });

    })
   );



 }

}
