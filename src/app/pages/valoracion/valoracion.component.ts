
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ValoracionService } from '../../services/valoraciones.service';
import moment from 'moment';
import { SucursalService } from '../../services/sucursal.service';
import { ListaPrecioService } from '../../services/listaPrecio.service';
import { ProductosService } from '../../services/productos.service';
import { ClientesService } from '../../services/clientes.service';
import { forkJoin } from 'rxjs';
import { NgVariante } from '../../components/ng-select-variante/ng-select-variante.component';
@Component({
  selector: 'app-valoracion',
  standalone: true,
  imports: [CommonModule, FormsModule,NgVariante ],
  templateUrl: './valoracion.component.html',
  styleUrl: './valoracion.component.css'
})
export class ValoracionComponent {
  registro: string = '';
  fechaDesde = moment(new Date()).format("YYYY-MM-DD");
  fechaHasta = moment(new Date()).format("YYYY-MM-DD");
  tipo: string = '';
  tipos: any[] = [];
  tiposArray: any[] = [{ id: '', descripcion: '-----SIN SELECCION------' },{ id: 'PRODUCTO', descripcion: 'Producto' }, { id: 'ESCALA', descripcion: 'Escala' }, { id: 'CLIENTE', descripcion: 'Cliente' }];
  valoraciones: any[] = [];
  sucursales: any[] = [];
  listasPrecio: any[] = [];
  variantes: any[] = [];


  private _router = inject(Router)
  _valoracionService = inject(ValoracionService);
  _sucursalService = inject(SucursalService);
  _varianteService = inject(ProductosService);
  _listaPrecioService = inject(ListaPrecioService);
  _clientesService = inject(ClientesService);
  constructor() {
    this.initList();
    const storedSearchData = localStorage.getItem('searchValoracionData');

    if (storedSearchData) {
      try {
        const parsedData = JSON.parse(storedSearchData);
        this.fechaDesde = parsedData.fechaDesde;
        this.fechaHasta = parsedData.fechaHasta;
        this.registro = parsedData.registro;
        this.tipo = parsedData.tipo;
      } catch (error) {
        console.error('Error parsing stored search data:', error);
      }
    }
  }
  ngOnInit() {
    this.buscar();
  }


  initList(){
    forkJoin([
      this._listaPrecioService.findAll(),
      this._sucursalService.findAll(),
      //this._varianteService.findAllDesc(),

    ]).subscribe(([listas, sucursales ]) => {
      this.listasPrecio =listas;
      this.sucursales =sucursales;
    //  this.variantes =variantes;
    });

  }
  cambioRegistro() {
    console.log(this.registro)
    switch (this.registro) {

      case 'PRECIO':
        {
          this.tipos = [{ id: '', descripcion: '-----SIN SELECCION------' },{ id: 'PRODUCTO', descripcion: 'Producto' }]
          this.tipo = ''
        }
        break;
      case 'DESCUENTO':
        {
          this.tipos = [{ id: '', descripcion: '-----SIN SELECCION------' },{ id: 'PRODUCTO', descripcion: 'Producto' }, { id: 'ESCALA', descripcion: 'Escala' }, { id: 'CLIENTE', descripcion: 'Cliente' }]
          this.tipo = ''
        }
        break;
      case 'PUNTO':
        {
          this.tipos = [{ id: '', descripcion: '-----SIN SELECCION------' },{ id: 'PRODUCTO', descripcion: 'Producto' }, { id: 'ESCALA', descripcion: 'Escala' },]
          this.tipo = ''
        }
        break;
      default: {
        this.tipos = []
        this.tipo = ''
      }
        break;
    }
  }
  cargarValoraciones(valoraciones: any[]) {
    this.valoraciones = valoraciones.map(valoracion => ({
      ...valoracion,
      isSelected: false,  // Por defecto, no seleccionado
      isEdit: false       // Por defecto, no en modo de edición
    }));
  }
  buscar() {
    localStorage.setItem('searchValoracionData', JSON.stringify({
      fechaDesde: this.fechaDesde,
      fechaHasta: this.fechaHasta,
      registro: this.registro,
      tipo: this.tipo,
    }));

    this._valoracionService
      .obtenerValoraciones(this.fechaDesde, this.fechaHasta, this.registro, this.tipo)
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
    this.fechaHasta = moment(new Date()).format("YYYY-MM-DD");
    this.tipo = '';

  }



}
