import { Component, OnInit, computed, inject, signal } from "@angular/core";
import { SeccionClienteComponent } from "../../components/seccion-cliente/seccion-cliente.component";
import { InputDebounceComponent } from "../../components/inputDebounce/inputDebounce.component";
import { ProductCardComponent } from "../../components/product-card/product-card.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IncrementadorComponent } from "../../components/incrementador/incrementador.component";
import { NgClienteSearchComponent } from "../../components/ng-cliente-search/ng-cliente-search.component";
import { Cliente } from "../../interfaces/clientes.interface";
import { ProductoPage, ProductosItem } from "../../interfaces/productoItem.inteface";
import { PaginatorComponent } from "../../components/paginator/paginator.component";
import { FormaVenta } from "../../interfaces/formaventa.interface";
import { ListaPrecio } from "../../interfaces/listaPrecio.interface";
import { Sucursal } from "../../interfaces/sucursal.interface";
import { AuthService } from "../../auth/services/auth.service";
import { Numeracion } from "../../interfaces/numeracion.interface";
import { NumeracionService ,ListaPrecioService ,FormaVentaService,SucursalService,ProductosService,ClientesService} from "../../services/service.index";
import { forkJoin } from "rxjs";
import Swal from "sweetalert2";
import { ModelCab, ModelDet } from "../../interfaces/facturas.interface";

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
 numeracion = signal<Numeracion>({ } as Numeracion);
 factura = signal<ModelCab>({}as ModelCab);
 cantidad: number = 1;
 searchCliente = false;
 terminoBusqueda:string ='';
 detalles: ModelDet[] =[]  ;
 //computacion
 productos = computed( () =>    this.productosPage().productos ?? []  );


  _authService = inject(AuthService);
  _productosService = inject(ProductosService);
  _clienteService = inject(ClientesService);
  _sucursalService = inject(SucursalService);
  _formaVentaService = inject(FormaVentaService);
  _listaPrecioService = inject(ListaPrecioService);
  _numeracionService = inject(NumeracionService);

   constructor() {
    forkJoin([
      this._sucursalService.getById(this._authService.sucursalId()!),
      this._numeracionService.getById(this._authService.numeracionPrefId()!),
      this._clienteService.findPredeterminado()
    ]).subscribe(([sucursal, numeracion, cliente]) => {
      this.sucursal.set(sucursal);
      this.numeracion.set(numeracion);
      this.cliente.set(cliente);

      forkJoin([
        this._formaVentaService.getById(cliente.formaVentaId),
        this._listaPrecioService.getById(cliente.listaPrecioId)
      ]).subscribe(([formaVenta, listaPrecio]) => {
        this.formaVenta.set(formaVenta);
        this.listaPrecio.set(listaPrecio);

        this.factura.update((prevValue) => ({
          ...prevValue,
          clienteId: this.cliente().id,
          sucursalId: this.sucursal().id,
          numeracionId: this.numeracion().id,
          listaPrecioId: this.listaPrecio().id,
          formaVentaId: this.formaVenta().id,
        }));
        this.getProductosPage(1);
      });
    });

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
    this.getProductosPage(1); // Reset to first page on search
  }

  onPageChanged(page: any) {
    this.getProductosPage(page as number);
  }


  getProductosPage(page: number) {
    this._productosService
      .searchProductoPage(1, 1, page, 10, 0, 0, 0, this.terminoBusqueda)
      .subscribe(resp => {
        this.productosPage.set(resp);
        this.page.set(resp.page);
        this.totalPages.set(resp.totalPages);
      }, err => {
        console.error(err);
      });
  }


  seleccionarProducto(item: ProductosItem) {
    if(!item.precio){
      Swal.fire('Atención', 'El producto no tiene precio', 'warning');
      return;
    }
    try {
      console.log(this.detalles)
      console.log(item)
      let indice = this.detalles.findIndex((d) => d.varianteId == item.id);
      //si no existe inicializar
      if (indice === -1) {
        const detalleInit:ModelDet  = {
          varianteId: item.id,
          descripcion: item.producto + ' ' + item.presentacion + ' ' + item.variedad,
          codErp: item.codErp,
          cantidad: 0,
          porcDescuento:0,
          porcIva:item.porcIva,
          importePrecio: 0 ,
          importeIva5: 0 ,
          importeIva10: 0 ,
          importeIvaExenta: 0 ,
          importeDescuento: 0,
          importeNeto: 0,
          importeSubtotal: 0,
          importeTotal: 0,
          totalKg: 0 ,
          tipoDescuento: ''
        };
        this.detalles.push(detalleInit);
        indice = this.detalles.findIndex((d) => d.varianteId == item.id);
      }

      //calcular detalles
      this.detalles[indice].cantidad +=   this.cantidad;
      this.detalles[indice].importePrecio =  item.precio;
      this.detalles[indice].importeSubtotal = this.detalles[indice].cantidad * item.precio;
      this.detalles[indice].totalKg = this.detalles[indice].cantidad * item.peso;

      //calcular descuento
       if (item.descuento && item.descuento > 0) {
        this.detalles[indice].porcDescuento =  item.descuento;
        this.detalles[indice].tipoDescuento =  'PRODUCTO';
        this.detalles[indice].importeDescuento = Math.round((this.detalles[indice].importeSubtotal *  this.detalles[indice].porcDescuento) / 100);
       } else {

       }
       //calcular total
       this.detalles[indice].importeTotal = this.detalles[indice].importeSubtotal - this.detalles[indice].importeDescuento;

       //calcular iva
       switch (this.detalles[indice].porcIva) {
        case 0:
          {
            this.detalles[indice].importeIva5 = 0;
            this.detalles[indice].importeIva10 = 0;
            this.detalles[indice].importeIvaExenta = this.detalles[indice].importeTotal;
            this.detalles[indice].importeNeto = this.detalles[indice].importeTotal;
          }
          break;
        case 5:
          {
            this.detalles[indice].importeIva5 = Math.round(this.detalles[indice].importeTotal / 21);
            this.detalles[indice].importeIva10 = 0;
            this.detalles[indice].importeIvaExenta = 0;
            this.detalles[indice].importeNeto = this.detalles[indice].importeTotal - this.detalles[indice].importeIva5;
          }
          break;
        case 10:
          {
              this.detalles[indice].importeIva10 = Math.round(this.detalles[indice].importeTotal / 11);
              this.detalles[indice].importeIva5 = 0;
              this.detalles[indice].importeIvaExenta = 0;
              this.detalles[indice].importeNeto = this.detalles[indice].importeTotal - this.detalles[indice].importeIva10;
          }
          break;
        default:
          break;
      }

      //Actualizar cabecera
      this.actualizarCabecera();
this.cantidad = 1;
    } catch (err) {
       console.error(err);
    }
  }

  actualizarCabecera() {
    const totalSubtotal = this.detalles.reduce((total, detalle) => total + detalle.importeSubtotal, 0);
    const totalIva5 = this.detalles.reduce((total, detalle) => total + detalle.importeIva5, 0);
    const totalIva10 = this.detalles.reduce((total, detalle) => total + detalle.importeIva10, 0);
    const totalIvaExenta = this.detalles.reduce((total, detalle) => total + detalle.importeIvaExenta, 0);
    const totalDescuento = this.detalles.reduce((total, detalle) => total + detalle.importeDescuento, 0);
    const totalNeto = totalSubtotal - totalDescuento;
    const totalTotal = totalNeto + totalIva5 + totalIva10 + totalIvaExenta;

    this.factura.update((value) => ({
      ...value,
      importeSubtotal: totalSubtotal,
      importeIva5: totalIva5,
      importeIva10: totalIva10,
      importeIvaExenta: totalIvaExenta,
      importeDescuento: totalDescuento,
      importeNeto: totalNeto,
      importeTotal: totalTotal,
    }));
  }
  sumarProducto(item: ProductosItem ) {
    const indice = this.detalles.findIndex((d) => d.varianteId == item.variedad);
    if (indice !== -1) {
      this.detalles[indice].cantidad += 1;
      this.detalles[indice].importeSubtotal = this.detalles[indice].cantidad * this.detalles[indice].importePrecio;
      this.detalles[indice].totalKg = this.detalles[indice].cantidad * item.peso;
      this.detalles[indice].importeDescuento = Math.round((this.detalles[indice].importeSubtotal *  this.detalles[indice].porcDescuento) / 100);
      this.detalles[indice].importeTotal = this.detalles[indice].importeSubtotal - this.detalles[indice].importeDescuento;

      this.actualizarCabecera();
    }
  }
  restarProducto(item: ProductosItem ) {
    const indice = this.detalles.findIndex((d) => d.varianteId == item.variedad);
    if (indice !== -1) {
      this.detalles[indice].cantidad -= 1;
      this.detalles[indice].importeSubtotal = this.detalles[indice].cantidad * this.detalles[indice].importePrecio;
      this.detalles[indice].totalKg = this.detalles[indice].cantidad * item.peso;
      this.detalles[indice].importeDescuento = Math.round((this.detalles[indice].importeSubtotal *  this.detalles[indice].porcDescuento) / 100);
      this.detalles[indice].importeTotal = this.detalles[indice].importeSubtotal - this.detalles[indice].importeDescuento;

      this.actualizarCabecera();
    }
  }
  quitarProducto(item: ProductosItem) {
    const indice = this.detalles.findIndex((d) => d.varianteId == item.variedad);
    if (indice !== -1) {
      this.detalles.splice(indice, 1);
      this.actualizarCabecera();
    }
  }

}
