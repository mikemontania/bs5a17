
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component,    inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ValoracionService } from '../../services/valoraciones.service';
import moment from 'moment';
import { SucursalService } from '../../services/sucursal.service';
import { ListaPrecioService } from '../../services/listaPrecio.service';
import { ProductosService } from '../../services/productos.service';
import { ClientesService } from '../../services/clientes.service';
import { forkJoin } from 'rxjs';
import { NgVariante } from '../../components/ng-select-variante/ng-select-variante.component';
import { CustomSelectComponent } from '../../components/custom-select/custom-select.component';
 @Component({
  selector: 'app-valoracion',
  standalone: true,
  imports: [CommonModule, FormsModule, NgVariante,CustomSelectComponent ],
  templateUrl: './valoracion.component.html',
  styleUrl: './valoracion.component.css'
})
export class ValoracionComponent implements OnInit {
  registro: string = '';
  tipo: string = '';
  fechaDesde = moment(new Date()).format("YYYY-MM-DD");
  tipos: any[] = [];
  valoraciones: any[] = [];
  sucursales: any[] = [];
  listasPrecio: any[] = [];
  variantes: any[] = [];
sucursalId:number =0;
listaPrecioId:number =1;
  private _router = inject(Router)
  _valoracionService = inject(ValoracionService);
  _sucursalService = inject(SucursalService);
  _varianteService = inject(ProductosService);
  _listaPrecioService = inject(ListaPrecioService);
  _clientesService = inject(ClientesService);
  private activatedRoute = inject(ActivatedRoute);



  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.registro = params.get('registro')!
      this.tipo = params.get('tipo')!
      console.log(this.tipo)
      this.buscar();
      this.initList();
    })
  }


  initList() {
    forkJoin([
      this._listaPrecioService.findAll(),
      this._sucursalService.findAll(),
      this._varianteService.findAllDescripcion(),

    ]).subscribe(([listas, sucursales,variantes]) => {
      this.listasPrecio = listas;
      this.sucursales = sucursales;
      this.sucursales.push({id:0,descripcion:'Todas'})
        this.variantes =variantes.resultados;
    });

  }
seleccionaVariante(valoracion:any, event:any){
  valoracion.variante.id = event?.id;
  valoracion.variante.producto.nombre = event?.concat;
  valoracion.variante.presentacion.descripcion = '';
  valoracion.variante.variedad.descripcion = '';
  valoracion.variante.codErp = '';
  valoracion.varianteId = event?.id
}

  obtenerSucursal(id:number){
    return this.sucursales.find(suc => suc.id == id)?.descripcion;
  }
  cargarValoraciones(valoraciones: any[]) {
    this.valoraciones = valoraciones.map(valoracion => ({
      ...valoracion,
      sucursalId: (valoracion.sucursalId === null)? 0:valoracion.sucursalId,
      isSelected: false,  // Por defecto, no seleccionado
      isEdit: false       // Por defecto, no en modo de edición
    }));
  }
  buscar() {
    localStorage.setItem('searchValoracionData', JSON.stringify({
      fechaDesde: this.fechaDesde,
      registro: this.registro,
      tipo: this.tipo,
    }));

    this._valoracionService
      .obtenerValoraciones(this.fechaDesde, this.registro, this.tipo, this.sucursalId, this.listaPrecioId)
      .subscribe({
        next: (resp) => {
          console.log(resp)
          this.cargarValoraciones(resp);
        },
        error: message => {
          console.error(message)
        }
      });
  }

  addRow() {
    const newRow = {
      id: Date.now().toString(),
      fechaDesde: '',
      fechaHasta: '',
      // Otros campos de la valoración
      isEdit: true,
    };
    this.valoraciones = [newRow, ...this.valoraciones];
  }

  removeRow(id: number) {
    this.valoraciones = this.valoraciones.filter((valoracion) => valoracion.id !== id);
  }

  removeSelectedRows() {


    this.valoraciones = this.valoraciones.filter((valoracion) => !valoracion.isSelected);


  }
listo(valoracion:any){
  console.log(valoracion)
   valoracion.isEdit = !valoracion.isEdit
}
  isAllSelected() {
    return this.valoraciones.every((valoracion) => valoracion.isSelected);
  }

  isAnySelected() {
    return this.valoraciones.some((valoracion) => valoracion.isSelected);
  }

  selectAll(event: any) {
    this.valoraciones = this.valoraciones.map((valoracion) => ({
      ...valoracion,
      isSelected: event.checked,
    }));
  }

  cancelar() {
    this.registro = '';
    this.fechaDesde = moment(new Date()).format("YYYY-MM-DD");
    this.tipo = '';

  }



}
