import { Component, OnInit, computed, inject, signal } from "@angular/core";
import { SeccionClienteComponent } from "../../components/seccion-cliente/seccion-cliente.component";
import { InputDebounceComponent } from "../../components/inputDebounce/inputDebounce.component";
import { ProductCardComponent } from "../../components/product-card/product-card.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IncrementadorComponent } from "../../components/incrementador/incrementador.component";
import { NgClienteSearchComponent } from "../../components/ng-cliente-search/ng-cliente-search.component";
import { Cliente } from "../../interfaces/clientes.interface";
import { ClientesService } from "../../services/clientes.service";
import { ProductosService } from "../../services/productos.service";
import { ProductoPage } from "../../interfaces/productoItem.inteface";
import { PaginatorComponent } from "../../components/paginator/paginator.component";
import { FormaVenta } from "../../interfaces/formaventa.interface";
import { ListaPrecio } from "../../interfaces/listaPrecio.interface";
import { SucursalService } from "../../services/sucursal.service";
import { FormaVentaService } from "../../services/formaVenta.service";
import { ListaPrecioService } from "../../services/listaPrecio.service";
import { Sucursal } from "../../interfaces/sucursal.interface";
import { AuthService } from "../../auth/services/auth.service";

@Component({
  selector: "app-ventas",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SeccionClienteComponent,
    InputDebounceComponent,
    ProductCardComponent,
    IncrementadorComponent,
    NgClienteSearchComponent,
    PaginatorComponent
  ],
  templateUrl: "./ventas.component.html",
  styleUrl: "./ventas.component.css"
})
export class VentasComponent implements OnInit {
  cliente = signal<Cliente>({ nroDocumento: "", razonSocial: "" } as Cliente);
  productosPage = signal<ProductoPage>({} as ProductoPage);
  page = signal<number>(1);
  totalPages = signal<number>(1);
 formaVenta = signal<FormaVenta>({ } as FormaVenta);
 listaPrecio = signal<ListaPrecio>({ } as ListaPrecio);
 sucursal = signal<Sucursal>({ } as Sucursal);

  cantidad: number = 1;
  searchCliente = false;
  terminoBusqueda:string ='';
//computacion
  productos = computed( () =>    this.productosPage().productos ?? []  );


  _authService = inject(AuthService);
  _productosService = inject(ProductosService);
  _clienteService = inject(ClientesService);
  _sucursalService = inject(SucursalService);
  _formaVentaService = inject(FormaVentaService);
  _listaPrecioService = inject(ListaPrecioService);

  constructor() {
    console.log(this._authService.currentUser() )
    this.getSucursalById(this._authService.currentUser() ?.sucursalId!)
    this._clienteService
      .findPredeterminado()
      .subscribe(resp => {
        this.cliente.set(resp)
        this.getFormaById(this.cliente().formaVentaId)
        this.getListaPrecioById(this.cliente().listaPrecioId)
      });
    this.fetchProductosPage(1); // Initial page load
  }


  ngOnInit() {}


  abrirBuscador() {
    this.searchCliente = true;
  }

  selectCliente(cliente: Cliente) {
    // Process the selected client
    console.log("Selected client:", cliente);
    this.cliente.set(cliente); // Update the client signal
    this.searchCliente = false; // Close the modal
  }

  buscar(event: any) {
    this.terminoBusqueda = event;
    this.fetchProductosPage(1); // Reset to first page on search
  }

  onPageChanged(page: any) {
    this.fetchProductosPage(page as number);
  }


  fetchProductosPage(page: number) {
    this._productosService
      .searchProductoPage(1, 1, page, 10, 0, 0, 0, this.terminoBusqueda)
      .subscribe(resp => {
        this.productosPage.set(resp);
        this.page.set(resp.page);
        this.totalPages.set(resp.totalPages);
      });
  }

  async getFormaById(id:number) {
     this._formaVentaService.getById(id).subscribe(resp =>      this.formaVenta.set(resp) )
  }
  async getListaPrecioById(id:number) {
    this._listaPrecioService.getById(id).subscribe(resp =>      this.listaPrecio.set(resp) )

  }
  async getSucursalById(id:number) {
    this._sucursalService.getById(id).subscribe(resp =>      this.sucursal.set(resp) )
  }

}
