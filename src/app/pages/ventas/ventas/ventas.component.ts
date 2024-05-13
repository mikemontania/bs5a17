import { Component, OnInit, computed, inject, signal } from "@angular/core";
import { SeccionClienteComponent } from "../../../components/seccion-cliente/seccion-cliente.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { Cliente } from "../../../interfaces/clientes.interface";
import { ProductosItem } from "../../../interfaces/productoItem.inteface";
import { FormaVenta } from "../../../interfaces/formaventa.interface";
import { ListaPrecio } from "../../../interfaces/listaPrecio.interface";
import { Sucursal } from "../../../interfaces/sucursal.interface";
import { AuthService } from "../../../auth/services/auth.service";
import { Numeracion } from "../../../interfaces/numeracion.interface";
import {
  NumeracionService,
  ListaPrecioService,
  FormaVentaService,
  SucursalService,
  ClientesService,
  VentasService,
  ValoracionService,
  ReportesService
} from "../../../services/service.index";
import { forkJoin, lastValueFrom } from "rxjs";
import Swal from "sweetalert2";
import { Cobranza, ModelCab, ModelDet } from "../../../interfaces/facturas.interface";
import { ProductsListComponent } from "../../../components/product-list/product-list.component";
import { NgSucursalSearchComponent } from "../../../components/ng-sucursal-search/ng-sucursal-search.component";
import { NgNumeracionSearchComponent } from "../../../components/ng-numeracion-search/ng-numeracion-search.component";
import { NgFormaVentaSearchComponent } from "../../../components/ng-forma-venta-search/ng-forma-venta-search.component";
import { NgListaPrecioSearchComponent } from "../../../components/ng-lista-precio-search/ng-lista-precio-search.component";
import { NgClienteCreateComponent } from "../../../components/ng-cliente-create/ng-cliente-create.component";
import { NgClienteSearchComponent } from "../../../components/ng-cliente-search/ng-cliente-search.component";
import { NgCobranzaCreateComponent } from '../../../components/ng-cobranza-create/ng-cobranza-create.component';
import { Valoracion } from "../../../interfaces/valoracion.interface";

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
    NgClienteCreateComponent,
    NgCobranzaCreateComponent
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
  cobranza = signal<Cobranza>({} as Cobranza);
  showShop = true;

  public userId = computed(() => this._authService.currentUser()?.id ?? 0);
  importeEscala: number = 1;
  cantidad: number = 1;
  searchCliente = false;
  searchSucursal = false;
  searchNumeracion = false;
  searchListaPrecio = false;
  searchFormaVenta = false;
  createCliente = false;
  createCobranza = false;
  detalles: ModelDet[] = [];
  descuentosEscala: Valoracion[] = [];

  _authService = inject(AuthService);
  _clienteService = inject(ClientesService);
  _sucursalService = inject(SucursalService);
  _formaVentaService = inject(FormaVentaService);
  _listaPrecioService = inject(ListaPrecioService);
  _numeracionService = inject(NumeracionService);
  _ventasService = inject(VentasService);
  _valoracionService = inject(ValoracionService);
  _reportService = inject(ReportesService);

  constructor() {
    this.initValues();
  }


  ngOnInit() { }

  initValues() {
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
      }));
      this.obtenerDescuentoEscala()
    });
  }
  createCobranzaModal() { this.createCobranza = true; }
  createClienteModal() { this.createCliente = true; }
  buscarCliente() { this.searchCliente = true; }
  buscarNumeracion() { this.searchNumeracion = true; }
  buscarFormaVenta() { this.searchFormaVenta = true; }
  buscarSucursal() {

    this.searchSucursal = true;
  }

  buscarListaPrecio() {

    this.searchListaPrecio = true;
  }

  obtenerDescuentoEscala() {
    try {
      this._valoracionService.obtenerDescuentoImporte(this.listaPrecio().id, this.sucursal().id).subscribe(resp => {
        this.descuentosEscala = (resp?.descuentos) ? resp?.descuentos : [];
      });
    } catch (error) {
      console.error(error);
    }
  }
  changeCantidad(cantidad: number) {
    this.cantidad = cantidad;
  }

  refresh() {
    this.showShop = false;
    setInterval(() => {
      this.showShop = true;
    }, 100);
  }
  registrar() {
    if (this.formaVenta().predeterminado) {
      this.createCobranzaModal();
    } else {
      this.pagar()
    }
  }

  guardarCobranza(cobranza: Cobranza) {
    console.log("Selected cobranza:", cobranza);
    this.cobranza.set(cobranza)
    this.createCobranza = false;
    this.pagar()
  }

  selectCliente(cliente: Cliente) {
    console.log("Selected client:", cliente);
    this.cliente.set(cliente); // Update the client signal
    this.searchCliente = false; // Close the modal
    this.actualizarCargador()
    this.reCalcular();
    this.refresh()
  }

  selectSucursal(sucursal: Sucursal) {
    console.log("Selected sucursal:", sucursal);
    this.sucursal.set(sucursal); // Update the client signal
    this.searchSucursal = false; // Close the modal
    this.numeracion.set({} as Numeracion);
    this.reCalcular();
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
    /*   this.refresh();
      this.detalles = [];
      this.actualizarCabecera(); */
    this.reCalcular();
  }


  async reCalcular() {
    try {
        console.log('reCalcular');

        Swal.fire({
            title: 'Espere por favor...',
            allowOutsideClick: false,
            icon: 'info',
        });
        Swal.showLoading();
        const respuesta: any = await lastValueFrom(this._valoracionService.obtenerDescuentoImporte(this.listaPrecio().id, this.sucursal().id));
        this.descuentosEscala = (respuesta?.descuentos) ? respuesta?.descuentos : [];

        for (const detalle of this.detalles) {
            try {
                console.log({ variedadID: detalle.varianteId, sucursalID: this.sucursal().id, listaPrecio: this.listaPrecio().id });
                const valoracion: any = await lastValueFrom(this._valoracionService.obtenerVigente(detalle.varianteId, this.sucursal().id, this.listaPrecio().id));
                if (valoracion) {
                    if (valoracion.precio) {
                        if (this.cliente().excentoIva == true) {
                            console.log(valoracion)
                            console.log(+valoracion.precio.variante.porcIva)
                            detalle.porcIva = 0;
                            if (+valoracion.precio.variante.porcIva == 0) {
                                detalle.importePrecio = valoracion.precio.valor;
                            } else if (+valoracion.precio.variante.porcIva == 5) {
                                detalle.importePrecio = valoracion.precio.valor - Math.round(valoracion.precio.valor / 21);
                            } else if (+valoracion.precio.variante.porcIva == 10) {
                                detalle.importePrecio = valoracion.precio.valor - Math.round(valoracion.precio.valor / 11);
                            }
                            console.log(detalle.importePrecio)
                        } else {
                            detalle.importePrecio = valoracion.precio.valor;
                        }

                        detalle.importeSubtotal = detalle.cantidad * detalle.importePrecio;
                        this.reAjustarDetalles();
                        this.actualizarCabecera();

                    }
                }
            } catch (error) {
                // Manejar el error de obtenerDescuentoEscala aquí
                console.error(`Error al obtener descuento de escala: ${error}`);
            }
        }

        Swal.close();
    } catch (error) {
        console.error(`Error al obtener descuento de escala: ${error}`);
    }
}



  // Función para inicializar un detalle
  inicializarDetalle(item: ProductosItem): ModelDet {
    return {
      varianteId: item.id,
      descripcion: item.producto + " " + item.presentacion + " " + item.variedad,
      codErp: item.codErp,
      cantidad: 0,
      porcDescuento: 0,
      porcIva: +item.porcIva,
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
        this.detalles.push(this.inicializarDetalle(item));
        indice = this.detalles.findIndex(d => d.varianteId == item.id);
      }
      console.log(this.cliente().excentoIva == true)
      if (item.precio) {
        // si el producto tiene precio
        if (this.cliente().excentoIva == true) {
          this.detalles[indice].porcIva = 0;
          if (+item.porcIva == 0) {
            this.detalles[indice].importePrecio = item.precio;
          } else if (+item.porcIva == 5) {
            this.detalles[indice].importePrecio = item.precio - Math.round(item.precio / 21);
          } else if (+item.porcIva == 10) {
            this.detalles[indice].importePrecio = item.precio - Math.round(item.precio / 11);
          }
        } else {
          this.detalles[indice].importePrecio = item.precio;

        }
      }
      this.detalles[indice].cantidad += this.cantidad;
      this.detalles[indice].importeSubtotal = this.detalles[indice].cantidad * this.detalles[indice].importePrecio;
      this.detalles[indice].totalKg = this.detalles[indice].cantidad * item.peso;

      // Calcular descuento
      if (item.descuento && item.descuento > 0) {
        this.detalles[indice].porcDescuento = item.descuento;
        this.detalles[indice].tipoDescuento = "PRODUCTO";
        this.detalles[indice].importeDescuento = Math.round(
          this.detalles[indice].importeSubtotal * this.detalles[indice].porcDescuento / 100
        );
      } else {
        this.detalles[indice].porcDescuento = 0;
        this.detalles[indice].tipoDescuento = "NINGUNO";
        this.detalles[indice].importeDescuento = 0;
      }
      this.reAjustarDetalles();
      this.actualizarCabecera();
      this.cantidad = 1;
    } catch (err) {
      console.error(err);
    }
  }

  // Función para ajustar los detalle porque podria haber ono descuento escala
  reAjustarDetalles() {
    const importeDescontable = this.detalles.reduce((subTotal, detalle) => (detalle.tipoDescuento !== 'PRODUCTO') ? subTotal + detalle.importeSubtotal : subTotal + 0, 0);
    const descuentoImporte = this.descuentosEscala.find(descuento =>
      descuento.cantDesde <= importeDescontable && descuento.cantHasta >= importeDescontable
    );
    console.log(descuentoImporte)
    this.detalles.forEach(detalle => {
      if (detalle.tipoDescuento !== 'PRODUCTO') {
        if (descuentoImporte) {
          detalle.porcDescuento = +descuentoImporte.valor;
          detalle.tipoDescuento = "IMPORTE";
          detalle.importeDescuento = Math.round(detalle.importeSubtotal * detalle.porcDescuento / 100);
        } else {
          detalle.porcDescuento = 0;
          detalle.tipoDescuento = "NINGUNO";
          detalle.importeDescuento = 0;
        }
      }

      let porcIva = +detalle.porcIva;
      let porcIva5 = 0;
      let porcIva10 = 0;
      let porcIvaExenta = 0;
      let porcNeto = 0;
      //calcular total
      detalle.importeTotal = detalle.importeSubtotal - detalle.importeDescuento;
      if (this.cliente().excentoIva == true) {
        porcIvaExenta = porcIva === 0 ? detalle.importeTotal : 0;
      } else {
        porcIva5 = porcIva === 5 ? Math.round(detalle.importeTotal / 21) : 0;
        porcIva10 = porcIva === 10 ? Math.round(detalle.importeTotal / 11) : 0;
        porcIvaExenta = porcIva === 0 ? detalle.importeTotal : 0;
        porcNeto = detalle.importeTotal - (porcIva5 + porcIva10);
      }
      // Asignar los resultados
      detalle.importeIva5 = porcIva5;
      detalle.importeIva10 = porcIva10;
      detalle.importeIvaExenta = porcIvaExenta;
      detalle.importeNeto = porcNeto;
    });


  }
  actualizarCabecera() {
    const totalSubtotal = this.detalles.reduce((total, detalle) => total + detalle.importeSubtotal, 0);
    const totalIva5 = this.detalles.reduce((total, detalle) => total + detalle.importeIva5, 0);
    const totalIva10 = this.detalles.reduce(
      (total, detalle) => total + detalle.importeIva10, 0); const totalIvaExenta = this.detalles.reduce((total, detalle) => total + detalle.importeIvaExenta,
        0);
    const totalDescuento = this.detalles.reduce((total, detalle) => total + detalle.importeDescuento, 0);
    const totalNeto = this.detalles.reduce((total, detalle) => total + detalle.importeNeto, 0);
    const totalTotal = this.detalles.reduce((total, detalle) => total + detalle.importeTotal, 0);
    const totalKg = this.detalles.reduce((totalKg, detalle) => totalKg + detalle.totalKg, 0);

    this.factura.update(value => ({
      ...value,
      importeSubtotal: totalSubtotal,
      importeIva5: totalIva5,
      importeIva10: totalIva10,
      importeIvaExenta: totalIvaExenta,
      importeDescuento: totalDescuento,
      importeNeto: totalNeto,
      importeTotal: totalTotal,
      totalKg: totalKg
    }));
  }

  ajusteCantidad(indice: number, valor: number) {
    if (valor == -1 && this.detalles[indice].cantidad == 1)
      return;
    if (indice !== -1) {
      const peso = (this.detalles[indice].totalKg / this.detalles[indice].cantidad)
      this.detalles[indice].cantidad = this.detalles[indice].cantidad + valor;
      this.detalles[indice].importeSubtotal = this.detalles[indice].cantidad * this.detalles[indice].importePrecio;
      this.detalles[indice].totalKg = this.detalles[indice].cantidad * peso; this.detalles[indice]
      this.reAjustarDetalles();
      this.actualizarCabecera();
      this.actualizarCabecera();
    }
  }

  quitarProducto(index: number) {
    if (index !== -1) {
      this.detalles.splice(index, 1);
      this.actualizarCabecera();
    }
  }


  pagar() {

    if (!this.cliente().id || !this.listaPrecio().id || !this.sucursal().id || !this.formaVenta().id || !this.numeracion().id) {
      Swal.fire("Atención", "Hay datos de cabecera incompletos", "warning");
      return;
    }

    if (this.detalles?.length < 1) {
      Swal.fire("Atención", "No hay detalles", "warning");
      return;
    }
    console.log('asdasd')
    const porcDescuento = ((this.factura().importeDescuento) * 100 / this.factura().importeSubtotal)
    this.factura.update(value => ({
      ...value,
      porcDescuento,
      sucursalId: this.sucursal().id,
      numeracionId: this.numeracion().id,
      listaPrecioId: this.listaPrecio().id,
      formaVentaId: this.formaVenta().id,
      clienteId: this.cliente().id,
      cobranza: this.cobranza(),
      detalles: this.detalles
    }));
    Swal.fire({
      title: 'Espere por favor...',
      allowOutsideClick: false,
      icon: 'info',
    });
    Swal.showLoading();
    // Actualización: Utiliza la sintaxis de suscripción más reciente
    this._ventasService.create(this.factura()).subscribe({
      next: async (resp) => {
        try {
          console.log(resp)
          this._reportService.getPdf(resp.id).subscribe((response: any) => {
            const fileURL = URL.createObjectURL(response);
            window.open(fileURL, '_blank');

          })
          Swal.close();
          Swal.fire('Factura guardada!!!', 'factura creada con exito!!! comprobante:' + resp.nroComprobante, 'success');
          this.initValues()
          this.detalles = [];
          this.factura.set({} as ModelCab);

        } catch (error) {
          console.error('Error fetching PDF:', error);
          // Handle error appropriately
        }
      },
      error: (err) => {
        console.error(err);
        Swal.fire("Error", err.msg, "error");
      },
    });
  }


  cancelar() {
    this.detalles = [];
    this.actualizarCabecera()
    this.initValues()
  }
}
