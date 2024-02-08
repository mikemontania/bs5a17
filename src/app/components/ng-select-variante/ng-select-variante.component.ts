import { Component, Injectable, Output, EventEmitter, ElementRef, Input, OnChanges, OnInit, inject } from '@angular/core';
 import {catchError, debounceTime, distinctUntilChanged, map, tap, switchMap} from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';
import { ProductosService } from '../../services/productos.service';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';

@Component({
  standalone: true,
  imports: [FormsModule,NgSelectModule,NgOptionHighlightModule],
  selector: 'ng-select-variante',
  templateUrl: './ng-select-variante.component.html',
  styles: [ ]
})
export class NgVariante implements OnInit {
  model: any;
  variantes: any [] = [];
  @Input() cargador: any;
  @Output('retornoObjeto') retornoObjeto: EventEmitter<any> = new EventEmitter();
  searching: boolean = false;
  searchFailed: boolean = false;
  people: any [] = [];
  peopleLoading = false;


  public _varianteServices = inject(ProductosService);
  public http = inject(HttpClient);

  ngOnInit() {
    this.cargar();
}

cargar() {
  this._varianteServices.findAllDesc(1,5000,'').subscribe((resp:any) => {
    this.variantes = resp.variantes ;
    });
}

onSearch(event:any) {
  let term = event.term;
  debounceTime(300);
  distinctUntilChanged();
if (term.length <= 1) {
this.ngOnInit();
return;
}
  console.log(term);
  this._varianteServices.findAllDesc(1,10,term).subscribe((resp:any) => {
    this.variantes = resp.variantes;
    console.log(this.variantes);
    });
}
selectedItem(item: any) {
  this.cargador = item.id;  // Cambiar a item.id para emitir solo el id
  this.retornoObjeto.emit(this.cargador);
}
    limpiar(){
      this.cargador = null;
      this.retornoObjeto.emit(this.cargador);
    }
}
