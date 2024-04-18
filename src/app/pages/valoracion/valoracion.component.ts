
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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
import Swal from 'sweetalert2';
import { Valoracion } from '../../interfaces/valoracion.interface';
import { Variante } from '../../interfaces/facturas.interface';
import { Cliente } from '../../interfaces/clientes.interface';
@Component({
  selector: 'app-valoracion',
  standalone: true,
  imports: [CommonModule, FormsModule, NgVariante, CustomSelectComponent],
  templateUrl: './valoracion.component.html',
  styleUrl: './valoracion.component.css'
})
export class ValoracionComponent implements OnInit {
  registro: string = '';
  tipo: string = '';
  fechaDesde = moment(new Date()).format("YYYY-MM-DD");
  tipos: any[] = [];
  valoraciones: Valoracion[] = [];
  sucursales: any[] = [];
  listasPrecio: any[] = [];
  variantes: any[] = [];
  sucursalId: number = 0;
  listaPrecioId: number = 1;
  selectAllCheckbox: boolean = false;
  valor='';
  key: string = '';       // Columna actualmente ordenada
  reverse: boolean = false;  // Dirección de la ordenación
  filterText: string = '';   // Texto de filtro
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
 if (!this.registro || !this.tipo)    this._router.navigateByUrl('/dashboard');

if (this.registro=='PRECIO' && this.tipo=='IMPORTE') this.valor = 'Gs.';
if (this.registro=='DESCUENTO' && this.tipo=='PRODUCTO') this.valor = '%';
if (this.registro=='DESCUENTO' && this.tipo=='IMPORTE') this.valor = '%';
if (this.registro=='DESCUENTO' && this.tipo=='CLIENTE') this.valor = '%';
if (this.registro=='PUNTO' && this.tipo=='PRODUCTO') this.valor = 'pts';
if (this.registro=='PUNTO' && this.tipo=='IMPORTE') this.valor = 'pts';

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

    ]).subscribe(([listas, sucursales, variantes]) => {
      this.listasPrecio = listas;
      this.sucursales = sucursales;
      this.sucursales.push({ id: 0, descripcion: 'Todas' })
      this.variantes = variantes.resultados;
    });

  }
  seleccionaVariante(valoracion: any, event: any) {
    valoracion.varianteId = event?.id;
    valoracion.variante.concat = event?.concat;
    valoracion.varianteId = event?.id
  }

  obtenerSucursal(id?: number) {
    if (id) {
      return this.sucursales.find(suc => suc.id == id)?.descripcion;
    }
    return 'Todas'
  }
  cargarValoraciones(valoraciones: any[]) {
    this.valoraciones = valoraciones.map(valoracion => ({
      ...valoracion,
      sucursalId: (valoracion.sucursalId === null) ? 0 : valoracion.sucursalId,
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
    let newRow :Valoracion = {} as Valoracion;
    newRow.variante = { }as Variante;
    newRow.cliente = { }as Cliente;
    newRow.cantHasta= 999999999;
    newRow.valor= 1;
    newRow.fechaDesde= this.fechaDesde;
    newRow.fechaHasta= this.fechaDesde;
    newRow.registro= this.registro,
    newRow.tipo= this.tipo;
    newRow.sucursalId= this.sucursalId;
    newRow.listaPrecioId= this.listaPrecioId;
    newRow.isSelected= false; // Asegúrate de inicializar isSelected
    newRow.isEdit= true;
    newRow.activo= true;
    this.valoraciones = [newRow, ...this.valoraciones];
  }

  removeRow(index: number) {
    Swal.fire({
      title: 'Está seguro que deseas continuar quitar los registros ?',
      text: `Los registros serán eliminandos`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar',
      cancelButtonText: 'No, Mantener registros',
      customClass: {
        confirmButton: 'btn btn-outline-success',  // Clase personalizada para el botón de confirmación
        cancelButton: 'btn btn-outline-danger'    // Clase personalizada para el botón de cancelación
      },
      buttonsStyling: false,
      reverseButtons: true
    }).then(async (result) => {
      if (result.value) {
        if (this.valoraciones[index]?.id) {
          this._valoracionService.deleteById(this.valoraciones[index]?.id!).subscribe({
            next: (resp) => {
              this.valoraciones = this.valoraciones.filter((valoracion, i) => i !== index);
            },
            error: (error) => {
              Swal.fire("Error", error.message, "error");
            },
          });
        } else {
          this.valoraciones = this.valoraciones.filter((valoracion, i) => i !== index);
        }
      }
    });
  }

  removeSelectedRows() {

    Swal.fire({
      title: 'Está seguro que deseas continuar quitar los registros ?',
      text: `Los registros serán eliminandos`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar',
      cancelButtonText: 'No, Mantener registros',
      customClass: {
        confirmButton: 'btn btn-outline-success',  // Clase personalizada para el botón de confirmación
        cancelButton: 'btn btn-outline-danger'    // Clase personalizada para el botón de cancelación
      },
      buttonsStyling: false,
      reverseButtons: true
    }).then(async (result) => {
      if (result.value) {
        const selectedRows = this.valoraciones.filter((valoracion) => valoracion.isSelected);

        if (selectedRows.length === 0) {
          return;
        }

        // Dividir las filas en dos grupos: con y sin ID
        const rowsWithId = selectedRows.filter((valoracion) => valoracion.id !== null);
        const rowsWithoutId = selectedRows.filter((valoracion) => valoracion.id === null);

        // Utilizar forkJoin solo para las filas con ID
        forkJoin(rowsWithId.map((valoracion) => this._valoracionService.deleteById(valoracion.id!)))
          .subscribe({
            next: (resp) => {
              // Eliminar las filas con ID del array
              this.valoraciones = this.valoraciones.filter((valoracion) => !valoracion.isSelected && valoracion.id !== null);

              // Quitar las filas sin ID del array
              this.valoraciones = this.valoraciones.filter((valoracion) => !valoracion.isSelected);
            },
            error: (error) => {
              Swal.fire("Error", error.message, "error");
            }
          });
      }
    });


  }
  guardar(valoracion: any) {
    Swal.fire({
      title: 'Espere por favor...',
      allowOutsideClick: false,
      icon: 'info',
    });
    Swal.showLoading();
    console.log(valoracion)
    if (valoracion.id) {
      this._valoracionService.update(valoracion).subscribe({
        next: (resp) => {
          valoracion.isEdit = false;
          Swal.close()
        },
        error: (error) => {
          Swal.close()
          Swal.fire("Error", error.message, "error");
        },
      });
    } else {
      this._valoracionService.create(valoracion).subscribe({
        next: (resp) => {
          valoracion.listaPrecio = this.listasPrecio.find(l => l.id == resp.listaPrecioId)
          valoracion.sucursal = this.sucursales.find(s => s.id == resp.sucursalId)
          valoracion.id = resp.id;
          valoracion.isEdit = false;
          Swal.close()
        },
        error: (error) => {
          Swal.close()
          Swal.fire("Error", error.message, "error");
        },

      });
    }


  }

  isAllSelected() {
    return this.valoraciones.length > 0 && this.valoraciones.every((valoracion) => valoracion.isSelected);
  }
  isAnySelected() {
    return this.valoraciones.some((valoracion) => valoracion.isSelected);
  }


  cloneSelectedRows() {
    const selectedRows = this.valoraciones.filter((valoracion) => valoracion.isSelected);
    if (selectedRows.length > 0) {
      const firstSelectedIndex = this.valoraciones.indexOf(selectedRows[0]);
      const clonedRows: Valoracion[] = selectedRows.map((row) => ({
        ...row,
        valor:+row.valor,
        cantDesde:+row.cantDesde,
        cantHasta:+row.cantHasta,
        id: null,
        isSelected: false,
        isEdit: true
      }));

      // Insertar las filas clonadas al principio del array
      this.valoraciones = [
        ...clonedRows  ,
        ...this.valoraciones
      ];
    }
  }

  selectAll(event: any) {
    this.selectAllCheckbox = event.target.checked;

    this.valoraciones = this.valoraciones.map((valoracion) => ({
      ...valoracion,
      isSelected: this.selectAllCheckbox,
    }));
  }

  cancelar() {
    this.valoraciones = [];
   this.ngOnInit()

  }

  sort(key: string): void {
    this.key = key;
    this.reverse = !this.reverse;
    this.valoraciones = this.sortData(this.valoraciones); // Llama a la función de ordenación
  }

  // Función para aplicar el filtrado
  applyFilter(): void {
    this.valoraciones = this.filterData(this.valoraciones); // Llama a la función de filtrado
  }

  // Función de ordenación de datos
  sortData(data: any[]): any[] {
    if (!this.key) {
      return data;
    }

    const isNumeric = !isNaN(parseFloat(data[0][this.key]));

    return data.sort((a, b) => {
      const valueA = isNumeric ? parseFloat(a[this.key]) : a[this.key].toLowerCase();
      const valueB = isNumeric ? parseFloat(b[this.key]) : b[this.key].toLowerCase();

      if (valueA < valueB) {
        return this.reverse ? 1 : -1;
      } else if (valueA > valueB) {
        return this.reverse ? -1 : 1;
      } else {
        return 0;
      }
    });
  }

  // Función de filtrado de datos
  filterData(data: any[]): any[] {
    if (!this.filterText) {
      return data;
    }

    return data.filter(item => {
      // Filtra según las propiedades que deseas
      return (
        item.valor.toLowerCase().includes(this.filterText.toLowerCase()) ||
        item.fechaDesde.toLowerCase().includes(this.filterText.toLowerCase()) ||
        item.fechaHasta.toLowerCase().includes(this.filterText.toLowerCase()) ||
        item.fechaHasta.toLowerCase().includes(this.filterText.toLowerCase()) ||

        item.valoracion?.cliente?.nroDocumento.toLowerCase().includes(this.filterText.toLowerCase()) ||
        item.valoracion?.cliente?.razonSocial.toLowerCase().includes(this.filterText.toLowerCase()) ||

        item.sucursal?.descripcion.toLowerCase().includes(this.filterText.toLowerCase()) ||
        item.listaPrecio?.descripcion.toLowerCase().includes(this.filterText.toLowerCase()) ||
        item.valoracion?.erp.toLowerCase().includes(this.filterText.toLowerCase()) ||
        item.valoracion?.producto?.nombre.toLowerCase().includes(this.filterText.toLowerCase()) ||
        item.valoracion?.variedad?.descripcion.toLowerCase().includes(this.filterText.toLowerCase()) ||
        item.valoracion?.presentacion?.descripcion.toLowerCase().includes(this.filterText.toLowerCase())
        // Agrega más propiedades de filtrado según tus necesidades
        // Ejemplo: item.otraPropiedad.toLowerCase().includes(this.filterText.toLowerCase())
      );
    });
  }
}
