import { Component, computed, inject, signal } from '@angular/core';

import { VentasService } from '../../../services/ventas.service';
import { CommonModule } from '@angular/common';
import { InputDebounceComponent } from '../../../components/inputDebounce/inputDebounce.component';
import { PaginatorComponent } from '../../../components/paginator/paginator.component';
import { VentasPage } from '../../../interfaces/pages.interfaces';
import { FormaVenta } from '../../../interfaces/formaventa.interface';
import { Cliente } from '../../../interfaces/clientes.interface';
import { Sucursal } from '../../../interfaces/sucursal.interface';
import { ListaPrecio } from '../../../interfaces/listaPrecio.interface';
import moment from 'moment';
import { NgSucursalSearchComponent } from '../../../components/ng-sucursal-search/ng-sucursal-search.component';
import { NgClienteSearchComponent } from '../../../components/ng-cliente-search/ng-cliente-search.component';
import { NgFormaVentaSearchComponent } from '../../../components/ng-forma-venta-search/ng-forma-venta-search.component';
import { NgListaPrecioSearchComponent } from '../../../components/ng-lista-precio-search/ng-lista-precio-search.component';
import { FormsModule } from '@angular/forms';
import { ReportesService } from '../../../services/reportes.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { SucursalService } from '../../../services/sucursal.service';
import { ListaPrecioService } from '../../../services/service.index';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule, InputDebounceComponent, PaginatorComponent, NgSucursalSearchComponent,
    NgClienteSearchComponent, NgFormaVentaSearchComponent, NgListaPrecioSearchComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  searchComprobante = signal<string>('');
  ventasPage = signal<VentasPage>({} as VentasPage);
  page = signal<number>(1);
  totalPages = signal<number>(1);
  pageSize = signal<number>(15);
  cliente = signal<Cliente | null>(null);
  fechaDesde = moment(new Date()).format("YYYY-MM-DD");
  fechaHasta = moment(new Date()).format("YYYY-MM-DD");
  role: string = '';
  sucursalSeleccionada: number = 0;
  listaSeleccionada: number = 1;
  searchCliente = false;
  searchSucursal = false;
  sucursales: Sucursal[] = [];
  listas: ListaPrecio[] = [];
  listaPrecio:ListaPrecio ={}as ListaPrecio;
  ventas = computed(() => this.ventasPage().ventas ?? []);
  clienteId = computed(() => this.cliente()?.id ?? 0);

  private _router = inject(Router)
  _ventasService = inject(VentasService);
  _sucursalesService = inject(SucursalService);
  _listasPrecioService = inject(ListaPrecioService);
  _reportService = inject(ReportesService)
  _authService = inject(AuthService)
  constructor( ) {
    const storedSearchData = localStorage.getItem('searchDataVenta');

    // Realizar las dos solicitudes HTTP simultáneamente
    forkJoin({
      sucursales: this._sucursalesService.findAll(),
      listas: this._listasPrecioService.findAll(),
      predeterminada: this._listasPrecioService.findPredeterminado()
    }).subscribe({
      next: (results) => {
        // Procesar los resultados
        this.sucursales = results.sucursales;
        this.listas = results.listas;
        this.listaPrecio=results.predeterminada;
        this.listaSeleccionada = results.predeterminada.id;
        // Resto del código para manejar los datos almacenados, si es necesario
        if (storedSearchData) {
          try {
            const parsedData = JSON.parse(storedSearchData);
            this.searchComprobante.set(parsedData.searchComprobante);
            this.cliente.set(parsedData.cliente);
            this.sucursalSeleccionada = parsedData.sucursalId;
            this.listaSeleccionada = parsedData.listaPrecioId;
            this.page.set(parsedData.page);
            this.pageSize.set(parsedData.pageSize);
            this.fechaDesde = parsedData.fechaDesde;
            this.fechaHasta = parsedData.fechaHasta;
          } catch (error) {
            console.error('Error parsing stored search data:', error);
          }
        }
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      }
    });
  }
  ngOnInit() {
    this.role = this._authService.currentUser()!.rol;
    if (this.role =='admin') {
      this.sucursalSeleccionada =0;
    }else{
      this.sucursalSeleccionada = this._authService.currentUser()!.sucursalId;
    }
    this.buscar();
  }
  buscar() {

    this.getPage(this.page()); // Reset to first page on search
  }
  debounceSearch(event: any) {
    this.searchComprobante.set(event);
    this.getPage(1); // Reset to first page on search
  }
  getPage(page: number) {
    if (!this.fechaDesde) {
      this.fechaDesde = moment(new Date()).format("YYYY-MM-DD");
    }
    if (!this.fechaHasta) {
      this.fechaHasta = moment(new Date()).format("YYYY-MM-DD");
    }
    this.page.set(page);

    localStorage.setItem('searchDataVenta', JSON.stringify({
      searchComprobante: this.searchComprobante(),
      cliente: this.cliente(),
      sucursalId: this.sucursalSeleccionada,
      listaPrecioId: this.listaSeleccionada,
      page: this.page(),
      pageSize: this.pageSize(),
      fechaDesde: this.fechaDesde,
      fechaHasta: this.fechaHasta,
    }));

    this._ventasService
      .search(this.page(), this.pageSize(), this.fechaDesde, this.fechaHasta, this.clienteId(), this.sucursalSeleccionada,  1, this.listaSeleccionada, this.searchComprobante())
      .subscribe({
        next: (resp) => {
          this.ventasPage.set(resp);
          console.log(resp)
          this.page.set(resp.page);
          this.totalPages.set(resp.totalPages);
        },
        error: message => {
          console.error(message)
        }
      });




  }
  buscarCliente() { this.searchCliente = true; }

  buscarSucursal() { this.searchSucursal = true }

  onPageChanged(newPage: number) {
    this.getPage(newPage);
  }
  selectCliente(cliente: Cliente) {
    console.log("Selected client:", cliente);
    this.cliente.set(cliente); // Update the client signal
    this.searchCliente = false; // Close the modal

  }



  verDetalles(ventaId: number) {
    this._router.navigate(['/ventas/detalles', ventaId]);

  }
  getDoc(id: number) {
    this._reportService.getPdf(id).subscribe((response: any) => {
      const fileURL = URL.createObjectURL(response);
      window.open(fileURL, '_blank');

    })
  }
  anular(id: number) {
    Swal.fire({
      title: 'Está segur@ que desea anular la factura?',
      text: `La factura serà anulada`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Anular',
      cancelButtonText: 'No, No anular ',
      customClass: {
        confirmButton: 'btn btn-success',  // Clase personalizada para el botón de confirmación
        cancelButton: 'btn btn-danger'    // Clase personalizada para el botón de cancelación
      },
      buttonsStyling: false,
      reverseButtons: true
    }).then(async (result) => {
      if (result.value) {
        this._ventasService.anular(id).subscribe((response: any) => {
          this.buscar()
          Swal.fire('Factura anulada!!!', 'factura anulada con exito!!! comprobante:', 'success');

        })
      }
    });


  }


  cancelar() {

    try {

      this.searchComprobante.set('');
      this.cliente.set({} as Cliente);
      if (this.role =='admin') {
        this.sucursalSeleccionada =0;
      }else{
        this.sucursalSeleccionada = this._authService.currentUser()!.sucursalId;
      }
      this.listaSeleccionada=this.listaPrecio.id;
      this.page.set(1);
      this.pageSize.set(10);
      this.fechaDesde = moment(new Date()).format("YYYY-MM-DD");
      this.fechaHasta = moment(new Date()).format("YYYY-MM-DD");
    } catch (error) {
      console.error('Error parsing stored search data:', error);
    }

  }



}
