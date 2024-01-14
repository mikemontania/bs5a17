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
import { FormControl, FormsModule } from '@angular/forms';
import { TooltipDirective } from '../../../directivas/tooltip.directive';
import { ReportesService } from '../../../services/reportes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule, InputDebounceComponent, PaginatorComponent, NgSucursalSearchComponent, TooltipDirective,
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
  sucursal = signal<Sucursal | null>(null);
  listaPrecio = signal<ListaPrecio | null>(null);
  formaVenta = signal<FormaVenta | null>(null);
  fechaDesde = moment(new Date()).format("YYYY-MM-DD");
  fechaHasta = moment(new Date()).format("YYYY-MM-DD");

  searchCliente = false;
  searchSucursal = false;
  searchListaPrecio = false;
  searchFormaVenta = false;

  ventas = computed(() => this.ventasPage().ventas ?? []);
  clienteId = computed(() => this.cliente()?.id ?? 0);
  sucursalId = computed(() => this.sucursal()?.id ?? 0);
  formaVentaId = computed(() => this.formaVenta()?.id ?? 0);
  listaPrecioId = computed(() => this.listaPrecio()?.id ?? 0);

  _ventasService = inject(VentasService);
  _reportService = inject(ReportesService)
  constructor() {
    const storedSearchData = localStorage.getItem('searchData');

    if (storedSearchData) {
      try {
        const parsedData = JSON.parse(storedSearchData);
        this.searchComprobante.set(parsedData.searchComprobante);
        this.cliente.set(parsedData.cliente);
        this.sucursal.set(parsedData.sucursal);
        this.listaPrecio.set(parsedData.listaPrecio);
        this.formaVenta.set(parsedData.formaVenta);
        this.page.set(parsedData.page);
        this.pageSize.set(parsedData.pageSize);
        this.fechaDesde=parsedData.fechaDesde;
        this.fechaHasta=parsedData.fechaHasta;
      } catch (error) {
        console.error('Error parsing stored search data:', error);
      }
    }
  }
  ngOnInit() {
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

    localStorage.setItem('searchData', JSON.stringify({
      searchComprobante: this.searchComprobante(),
      cliente: this.cliente(),
      sucursal: this.sucursal(),
      listaPrecio: this.listaPrecio(),
      formaVenta: this.formaVenta(),
      page:this.page(),
      pageSize:this.pageSize(),
      fechaDesde:this.fechaDesde,
      fechaHasta:this.fechaHasta,
    }));

    this._ventasService
      .search(this.page(), this.pageSize(), this.fechaDesde, this.fechaHasta, this.clienteId(), this.sucursalId(), this.formaVentaId(), this.listaPrecioId(), this.searchComprobante())
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

  buscarFormaVenta() { this.searchFormaVenta = true; }
  buscarSucursal() { this.searchSucursal = true }
  buscarListaPrecio() { this.searchListaPrecio = true }

  onPageChanged(newPage: number) {
    this.getPage(newPage);
  }
  selectCliente(cliente: Cliente) {
    console.log("Selected client:", cliente);
    this.cliente.set(cliente); // Update the client signal
    this.searchCliente = false; // Close the modal

  }

  selectSucursal(sucursal: Sucursal) {
    console.log("Selected sucursal:", sucursal);
    this.sucursal.set(sucursal); // Update the client signal
    this.searchSucursal = false; // Close the modal

  }

  selectFormaVenta(formaVenta: FormaVenta) {
    console.log("Selected formaVenta:", formaVenta);
    this.formaVenta.set(formaVenta); // Update the client signal
    this.searchFormaVenta = false; // Close the modal
  }
  selectListaPrecio(listaPrecio: ListaPrecio) {
    console.log("Selected listaPrecio:", listaPrecio);
    this.listaPrecio.set(listaPrecio); // Update the client signal
    this.searchListaPrecio = false; // Close the modal

  }

 getDoc(id:number){
  this._reportService.getPdf(id).subscribe((response: any) => {
    const fileURL = URL.createObjectURL(response);
    window.open(fileURL, '_blank');

  })
 }
 anular(id:number){
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
          Swal.fire('Factura anulada!!!', 'factura anulada con exito!!! comprobante:'  , 'success');

        })
      }
    });


 }

}
