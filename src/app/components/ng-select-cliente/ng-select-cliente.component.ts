import { Component, Injectable, Output, EventEmitter, ElementRef, Input, OnChanges, OnInit } from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, map, tap, switchMap} from 'rxjs/operators';
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente/cliente.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  standalone: true,
  imports: [FormsModule,NgSelectModule,NgOptionHighlightModule],
  selector: 'ng-select-clientes',
  templateUrl: './ng-select-cliente.component.html',
  providers: [ClienteService],
  styles: [ ]
})
export class NGSelectClienteComponent implements OnInit {
  model: any;
  clientes: Cliente [] = [];
  @Input() cargadorCliente: Cliente;
  @Output('retornoObjeto') retornoObjeto: EventEmitter<Cliente> = new EventEmitter();
  searching: boolean = false;
  searchFailed: boolean = false;
  people: any [] = [];
  peopleLoading = false;




  constructor(public _clienteServices: ClienteService, private http: HttpClient) {}

  ngOnInit() {
    this.cargarClientes();
}

cargarClientes() {
  this._clienteServices.cargarClientes().subscribe(resp => {
    this.clientes = resp.content as Cliente [];
    console.log(this.clientes);
    });
}

onSearch(event) {
  let term = event.term;
  debounceTime(300);
  distinctUntilChanged();
if (term.length <= 1) {
this.ngOnInit();
return;
}
  console.log(term);
  this._clienteServices.buscarClientesActivos(term).subscribe(clientes => {
    this.clientes = clientes as Cliente [];
    console.log(this.clientes);
    });
}
    selectedItem(item) {
      this.cargadorCliente = item;
     this.retornoObjeto.emit(  this.cargadorCliente);
    }
    limpiar(){
      this.cargadorCliente = null;
      this.retornoObjeto.emit(this.cargadorCliente);
    }
}
