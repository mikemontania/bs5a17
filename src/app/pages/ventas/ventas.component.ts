import { Component, OnInit, computed, inject, signal } from "@angular/core";
import { SeccionClienteComponent } from "../../components/seccion-cliente/seccion-cliente.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgClienteSearchComponent } from "../../components/ng-cliente-search/ng-cliente-search.component";
import { Cliente } from "../../interfaces/clientes.interface";
import { ProductosItem } from "../../interfaces/productoItem.inteface";
import { FormaVenta } from "../../interfaces/formaventa.interface";
import { ListaPrecio } from "../../interfaces/listaPrecio.interface";
import { Sucursal } from "../../interfaces/sucursal.interface";
import { AuthService } from "../../auth/services/auth.service";
import { Numeracion } from "../../interfaces/numeracion.interface";
import {
  NumeracionService,
  ListaPrecioService,
  FormaVentaService,
  SucursalService,
   ClientesService
} from "../../services/service.index";
import { forkJoin } from "rxjs";
import Swal from "sweetalert2";
import { ModelCab, ModelDet } from "../../interfaces/facturas.interface";
import { ProductsListComponent } from "../../components/product-list/product-list.component";
import { NgSucursalSearchComponent } from "../../components/ng-sucursal-search/ng-sucursal-search.component";
import { NgNumeracionSearchComponent } from "../../components/ng-numeracion-search/ng-numeracion-search.component";
import { NgFormaVentaSearchComponent } from "../../components/ng-forma-venta-search/ng-forma-venta-search.component";
import { NgListaPrecioSearchComponent } from "../../components/ng-lista-precio-search/ng-lista-precio-search.component";

@Component({
  selector: "app-ventas",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SeccionClienteComponent,
    NgClienteSearchComponent,
    NgSucursalSearchComponent,
    NgNumeracionSearchComponent,
    NgFormaVentaSearchComponent,
    NgListaPrecioSearchComponent,
    ProductsListComponent,

  ],
  templateUrl: "./ventas.component.html",
  styleUrl: "./ventas.component.css"
})
export class VentasComponent implements OnInit {
  cliente = signal<Cliente>({ nroDocumento: "", razonSocial: "" } as Cliente);
  formaVenta = signal<FormaVenta>({} as FormaVenta);
  listaPrecio = signal<ListaPrecio>({} as ListaPrecio);
  sucursal = signal<Sucursal>({} as Sucursal);
  numeracion = signal<Numeracion>({} as Numeracion);
  factura = signal<ModelCab>({} as ModelCab);

  cantidad: number = 1;
  searchCliente = false;
  searchSucursal = false;
  searchNumeracion = false;
  searchListaPrecio = false;
  searchFormaVenta = false;
  detalles: ModelDet[] = [];

  _authService = inject(AuthService);
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
      this.actualizarCargador();
    });
  }

  ngOnInit() {}

  actualizarCargador() {
    forkJoin([
      this._formaVentaService.getById(this.cliente().formaVentaId),
      this._listaPrecioService.getById(this.cliente().listaPrecioId)
    ]).subscribe(([formaVenta, listaPrecio]) => {
      this.formaVenta.set(formaVenta);
      this.listaPrecio.set(listaPrecio);
      this.factura.update(prevValue => ({
        ...prevValue,
        clienteId: this.cliente().id,
        sucursalId: this.sucursal().id,
        numeracionId: this.numeracion().id,
        listaPrecioId: this.listaPrecio().id,
        formaVentaId: this.formaVenta().id,
        importeDescuento: 0,
        importeTotal: 0,
        importeSubtotal: 0
      }));
    });
  }

  buscarCliente() {
    this.searchCliente = true;
  }
  buscarNumeracion() {
    this.searchNumeracion = true;
  }
  buscarFormaVenta() {
    this.searchFormaVenta = true;
  }
  buscarSucursal() {
    this.searchSucursal = true;
  }
  buscarListaPrecio() {
    this.searchListaPrecio = true;
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
  selectNumeracion(numeracion: Numeracion) {
    console.log("Selected Numeracion:", numeracion);
    this.numeracion.set(numeracion); // Update the client signal
    this.searchNumeracion = false; // Close the modal
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



  seleccionarProducto(item: ProductosItem) {
    if (!item.precio) {
      Swal.fire("Atención", "El producto no tiene precio", "warning");
      return;
    }
    try {
      console.log(this.detalles);
      console.log(item);
      let indice = this.detalles.findIndex(d => d.varianteId == item.id);
      //si no existe inicializar
      if (indice === -1) {
        const detalleInit: ModelDet = {
          varianteId: item.id,
          descripcion:
            item.producto + " " + item.presentacion + " " + item.variedad,
          codErp: item.codErp,
          cantidad: 0,
          porcDescuento: 0,
          porcIva: item.porcIva,
          importePrecio: 0,
          importeIva5: 0,
          importeIva10: 0,
          importeIvaExenta: 0,
          importeDescuento: 0,
          importeNeto: 0,
          importeSubtotal: 0,
          importeTotal: 0,
          totalKg: 0,
          tipoDescuento: ""
        };
        this.detalles.push(detalleInit);
        indice = this.detalles.findIndex(d => d.varianteId == item.id);
      }

      //calcular detalles
      this.detalles[indice].cantidad += this.cantidad;
      this.detalles[indice].importePrecio = item.precio;
      this.detalles[indice].importeSubtotal =
        this.detalles[indice].cantidad * item.precio;
      this.detalles[indice].totalKg =
        this.detalles[indice].cantidad * item.peso;

      //calcular descuento
      if (item.descuento && item.descuento > 0) {
        this.detalles[indice].porcDescuento = item.descuento;
        this.detalles[indice].tipoDescuento = "PRODUCTO";
        this.detalles[indice].importeDescuento = Math.round(
          this.detalles[indice].importeSubtotal *
            this.detalles[indice].porcDescuento /
            100
        );
      } else {
      }
      //calcular total
      this.detalles[indice].importeTotal =
        this.detalles[indice].importeSubtotal -
        this.detalles[indice].importeDescuento;

      //calcular iva
      switch (this.detalles[indice].porcIva) {
        case 0:
          {
            this.detalles[indice].importeIva5 = 0;
            this.detalles[indice].importeIva10 = 0;
            this.detalles[indice].importeIvaExenta = this.detalles[
              indice
            ].importeTotal;
            this.detalles[indice].importeNeto = this.detalles[
              indice
            ].importeTotal;
          }
          break;
        case 5:
          {
            this.detalles[indice].importeIva5 = Math.round(
              this.detalles[indice].importeTotal / 21
            );
            this.detalles[indice].importeIva10 = 0;
            this.detalles[indice].importeIvaExenta = 0;
            this.detalles[indice].importeNeto =
              this.detalles[indice].importeTotal -
              this.detalles[indice].importeIva5;
          }
          break;
        case 10:
          {
            this.detalles[indice].importeIva10 = Math.round(
              this.detalles[indice].importeTotal / 11
            );
            this.detalles[indice].importeIva5 = 0;
            this.detalles[indice].importeIvaExenta = 0;
            this.detalles[indice].importeNeto =
              this.detalles[indice].importeTotal -
              this.detalles[indice].importeIva10;
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
    const totalSubtotal = this.detalles.reduce(
      (total, detalle) => total + detalle.importeSubtotal,
      0
    );
    const totalIva5 = this.detalles.reduce(
      (total, detalle) => total + detalle.importeIva5,
      0
    );
    const totalIva10 = this.detalles.reduce(
      (total, detalle) => total + detalle.importeIva10,
      0
    );
    const totalIvaExenta = this.detalles.reduce(
      (total, detalle) => total + detalle.importeIvaExenta,
      0
    );
    const totalDescuento = this.detalles.reduce(
      (total, detalle) => total + detalle.importeDescuento,
      0
    );
    const totalNeto = totalSubtotal - totalDescuento;
    const totalTotal = totalNeto + totalIva5 + totalIva10 + totalIvaExenta;

    this.factura.update(value => ({
      ...value,
      importeSubtotal: totalSubtotal,
      importeIva5: totalIva5,
      importeIva10: totalIva10,
      importeIvaExenta: totalIvaExenta,
      importeDescuento: totalDescuento,
      importeNeto: totalNeto,
      importeTotal: totalTotal
    }));
  }
  sumarProducto(item: ProductosItem) {
    const indice = this.detalles.findIndex(d => d.varianteId == item.id);
    if (indice !== -1) {
      this.detalles[indice].cantidad += 1;
      this.detalles[indice].importeSubtotal =
        this.detalles[indice].cantidad * this.detalles[indice].importePrecio;
      this.detalles[indice].totalKg =
        this.detalles[indice].cantidad * item.peso;
      this.detalles[indice].importeDescuento = Math.round(
        this.detalles[indice].importeSubtotal *
          this.detalles[indice].porcDescuento /
          100
      );
      this.detalles[indice].importeTotal =
        this.detalles[indice].importeSubtotal -
        this.detalles[indice].importeDescuento;

      this.actualizarCabecera();
    }
  }
  restarProducto(item: ProductosItem) {
    const indice = this.detalles.findIndex(d => d.varianteId == item.id);
    if (indice !== -1) {
      this.detalles[indice].cantidad -= 1;
      this.detalles[indice].importeSubtotal =
        this.detalles[indice].cantidad * this.detalles[indice].importePrecio;
      this.detalles[indice].totalKg =
        this.detalles[indice].cantidad * item.peso;
      this.detalles[indice].importeDescuento = Math.round(
        this.detalles[indice].importeSubtotal *
          this.detalles[indice].porcDescuento /
          100
      );
      this.detalles[indice].importeTotal =
        this.detalles[indice].importeSubtotal -
        this.detalles[indice].importeDescuento;

      this.actualizarCabecera();
    }
  }
  quitarProducto(item: ProductosItem) {
    const indice = this.detalles.findIndex(d => d.varianteId == item.id);
    if (indice !== -1) {
      this.detalles.splice(indice, 1);
      this.actualizarCabecera();
    }
  }
}
