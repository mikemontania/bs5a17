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

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, InputDebounceComponent, PaginatorComponent, NgSucursalSearchComponent, NgClienteSearchComponent, NgFormaVentaSearchComponent, NgListaPrecioSearchComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  searchComprobante = signal<string>('');
  ventasPage = signal<VentasPage>({} as VentasPage);
  page = signal<number>(1);
  totalPages = signal<number>(1);
  pageSize = signal<number>(15);
  fechaDesdeS = signal<string>(moment(new Date()).format('YYYY-MM-DD'));
  fechaHastaS = signal<string>(moment(new Date()).format('YYYY-MM-DD'));
  cliente = signal<Cliente | null>(null );
  sucursal = signal<Sucursal | null>(null );
  listaPrecio = signal<ListaPrecio | null>( null);
  formaVenta = signal<FormaVenta | null>( null);


  searchCliente = false;
  searchSucursal = false;
  searchListaPrecio = false;
  searchFormaVenta = false;

  ventas = computed(() => this.ventasPage().ventas ?? []);
  clienteId = computed(() => this.cliente()?.id ?? 0);
  fechaDesde = computed(() => this.fechaDesdeS() ?? moment(new Date()).format('YYYY-MM-DD'));
  fechaHasta = computed(() => this.fechaHastaS() ?? moment(new Date()).format("YYYY-MM-DD"));
  sucursalId = computed(() => this.sucursal()?.id ?? 0);
  formaVentaId = computed(() => this.formaVenta()?.id ?? 0);
  listaPrecioId = computed(() => this.listaPrecio()?.id ?? 0);

  _ventasService = inject(VentasService);


  ngOnInit() {
    this.buscar(this.searchComprobante);
  }
  buscar(event: any) {
    this.searchComprobante.set(event);
    this.getPage(1); // Reset to first page on search
  }
  getPage(page: number) {
    this.page.set(page);
    this._ventasService
      .search(this.page(), this.pageSize(), this.fechaDesde(), this.fechaHasta(), this.clienteId(), this.sucursalId(), this.formaVentaId(), this.listaPrecioId(), this.searchComprobante())
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
  buscarSucursal() {    this.searchSucursal = true  }
  buscarListaPrecio() {    this.searchListaPrecio = true  }

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



}
