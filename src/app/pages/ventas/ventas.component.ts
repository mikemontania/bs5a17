import { Component, OnInit,  inject, signal } from "@angular/core";
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
  ClientesService,
  VentasService,
  ValoracionService
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
    ProductsListComponent
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
  showShop = true;

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
  _ventasService = inject(VentasService);
  _valoracionService = inject(ValoracionService);


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

  buscarCliente() {    this.searchCliente = true;  }
  buscarNumeracion() {    this.searchNumeracion = true;  }
  buscarFormaVenta() {    this.searchFormaVenta = true;  }
  buscarSucursal() {

    if (this.detalles?.length >0) {
      Swal.fire({
        title: 'Está seguro que desea cambiar de sucursal?',
        text: `Serán descartados los items agregados`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Guardar',
        cancelButtonText: 'No, volver ',
          customClass: {
        confirmButton: 'btn btn-success',  // Clase personalizada para el botón de confirmación
        cancelButton: 'btn btn-danger'    // Clase personalizada para el botón de cancelación
      },
        buttonsStyling: false,
        reverseButtons: true
      }).then(async (result) => {
        if (result.value) {
          this.searchSucursal = true
        }
      });
    }else{
      this.searchSucursal = true ;
    }

       }
  buscarListaPrecio() {
    if (this.detalles?.length >0) {
      Swal.fire({
        title: 'Está seguro que desea cambiar de lista de precio?',
        text: `Serán descartados los items agregados`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Guardar',
        cancelButtonText: 'No, volver ',
          customClass: {
        confirmButton: 'btn btn-success',  // Clase personalizada para el botón de confirmación
        cancelButton: 'btn btn-danger'    // Clase personalizada para el botón de cancelación
      },
        buttonsStyling: false,
        reverseButtons: true
      }).then(async (result) => {
        if (result.value) {
          this.searchListaPrecio = true
        }
      });
    }else{
      this.searchListaPrecio = true ;
    }
    }


    changeCantidad(cantidad:number){
      this.cantidad=cantidad;
    }

refresh(){
 this.showShop=false;
  setInterval(() => {
    this.showShop = true;
  }, 100);
}

  selectCliente(cliente: Cliente) {
    console.log("Selected client:", cliente);
    this.cliente.set(cliente); // Update the client signal
    this.searchCliente = false; // Close the modal
   this.actualizarCargador()

  }

  selectSucursal(sucursal: Sucursal) {
    console.log("Selected sucursal:", sucursal);
    this.sucursal.set(sucursal); // Update the client signal
    this.searchSucursal = false; // Close the modal
    this.numeracion.set({} as Numeracion);
    this.refresh();
    this.detalles= [];
    this.actualizarCabecera();
    //this.reCalcular();
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
    this.refresh();
    this.detalles= [];
    this.actualizarCabecera();
    //this.reCalcular();
  }


  async reCalcular(){
  for await (const detalle of this.detalles) {
    const valoracion:any = await this._valoracionService.obtenerVigente(detalle.varianteId, this.sucursal().id,this.listaPrecio().id);
    if (valoracion) {
      if(valoracion.descuento){
       detalle.porcDescuento = valoracion.descuento.valor;
       detalle.tipoDescuento = valoracion.descuento.tipo;
      }
      if(valoracion.precio) {
        detalle.importePrecio = valoracion.precio.valor;
       }else{
        detalle.importePrecio = 0;
      }
      detalle.importeSubtotal = detalle.cantidad * detalle.importePrecio;
      detalle.importeDescuento = Math.round((detalle.importeSubtotal * detalle.porcDescuento) / 100);
    detalle.importeTotal = detalle.importeSubtotal - detalle.importeDescuento;
    const porcIva = detalle.porcIva;
    const porcIva5 = porcIva === 5 ? Math.round(detalle.importeTotal / 21) : 0;
    const porcIva10 = porcIva === 10 ? Math.round(detalle.importeTotal / 11) : 0;
    const porcIvaExenta = porcIva === 0 ? detalle.importeTotal : 0;
    const porcNeto = detalle.importeTotal - (porcIva5 + porcIva10);
    // Asignar los resultados

    detalle.importeIva5 = porcIva5;
    detalle.importeIva10 = porcIva10;
    detalle.importeIvaExenta = porcIvaExenta;
    detalle.importeNeto = porcNeto

    }else{
      detalle.importePrecio = 0;
      detalle.importeIva5= 0;
      detalle.importeIva10= 0;
      detalle.importeIvaExenta=0;
      detalle.importeDescuento=0;
      detalle.importeNeto=0;
      detalle.importeSubtotal=0;
      detalle.importeTotal=0;
    }


  }


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
      this.detalles[indice].totalKg =(this.detalles[indice].cantidad * item.peso) ;

      //calcular descuento
      if (item.descuento && item.descuento > 0) {
        this.detalles[indice].porcDescuento = item.descuento;
        this.detalles[indice].tipoDescuento = "PRODUCTO";
        this.detalles[indice].importeDescuento = Math.round(          this.detalles[indice].importeSubtotal *            this.detalles[indice].porcDescuento /           100
        );
      } else {
      }
      //calcular total
       this.detalles[indice].importeTotal = this.detalles[indice].importeSubtotal - this.detalles[indice].importeDescuento;

        const porcIva = this.detalles[indice].porcIva;
        const porcIva5 = porcIva === 5 ? Math.round(this.detalles[indice].importeTotal / 21) : 0;
        const porcIva10 = porcIva === 10 ? Math.round(this.detalles[indice].importeTotal / 11) : 0;
        const porcIvaExenta = porcIva === 0 ? this.detalles[indice].importeTotal : 0;
        const porcNeto = this.detalles[indice].importeTotal - (porcIva5 + porcIva10);
        // Asignar los resultados

        this.detalles[indice].importeIva5 = porcIva5;
        this.detalles[indice].importeIva10 = porcIva10;
        this.detalles[indice].importeIvaExenta = porcIvaExenta;
        this.detalles[indice].importeNeto = porcNeto;

      //Actualizar cabecera
      this.actualizarCabecera();
      this.cantidad = 1;
    } catch (err) {
      console.error(err);
    }
  }

  actualizarCabecera() {
    const totalSubtotal = this.detalles.reduce(      (total, detalle) => total + detalle.importeSubtotal,      0    );
    const totalIva5 = this.detalles.reduce(      (total, detalle) => total + detalle.importeIva5,      0    );
    const totalIva10 = this.detalles.reduce(
      (total, detalle) => total + detalle.importeIva10,      0    );    const totalIvaExenta = this.detalles.reduce(      (total, detalle) => total + detalle.importeIvaExenta,
      0    );
    const totalDescuento = this.detalles.reduce(      (total, detalle) => total + detalle.importeDescuento,      0    );
    const totalNeto = totalSubtotal - totalDescuento;    const totalTotal = totalNeto + totalIva5 + totalIva10 + totalIvaExenta;
    const totalKg = this.detalles.reduce(      (totalKg, detalle) => totalKg + detalle.totalKg,      0    );

    this.factura.update(value => ({
      ...value,
      importeSubtotal: totalSubtotal,
      importeIva5: totalIva5,
      importeIva10: totalIva10,
      importeIvaExenta: totalIvaExenta,
      importeDescuento: totalDescuento,
      importeNeto: totalNeto,
      importeTotal: totalTotal,
      totalKg:totalKg
    }));
  }

  ajusteCantidad(indice: number, valor:number) {
    if (valor == -1 && this.detalles[indice].cantidad ==1)
     return;
    if (indice !== -1) {
      const peso = (this.detalles[indice].totalKg/this.detalles[indice].cantidad)
      this.detalles[indice].cantidad = this.detalles[indice].cantidad + valor;
      this.detalles[indice].importeSubtotal = this.detalles[indice].cantidad * this.detalles[indice].importePrecio;
      this.detalles[indice].totalKg = this.detalles[indice].cantidad * peso;
      this.detalles[indice].importeDescuento = Math.round( this.detalles[indice].importeSubtotal *this.detalles[indice].porcDescuento / 100);
      this.detalles[indice].importeTotal =        this.detalles[indice].importeSubtotal -        this.detalles[indice].importeDescuento;

      const porcIva = this.detalles[indice].porcIva;
      const porcIva5 = porcIva === 5 ? Math.round(this.detalles[indice].importeTotal / 21) : 0;
      const porcIva10 = porcIva === 10 ? Math.round(this.detalles[indice].importeTotal / 11) : 0;
      const porcIvaExenta = porcIva === 0 ? this.detalles[indice].importeTotal : 0;
      const porcNeto = this.detalles[indice].importeTotal - (porcIva5 + porcIva10);
      // Asignar los resultados

      this.detalles[indice].importeIva5 = porcIva5;
      this.detalles[indice].importeIva10 = porcIva10;
      this.detalles[indice].importeIvaExenta = porcIvaExenta;
      this.detalles[indice].importeNeto = porcNeto
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
    const porcDescuento=((this.factura().importeDescuento)*100/this.factura().importeSubtotal)
    this.factura.update(value => ({
      ...value,
      porcDescuento,
      sucursalId:    this.sucursal().id,
      numeracionId: this.numeracion().id,
      listaPrecioId: this.listaPrecio().id,
      formaVentaId: this.formaVenta().id,
      clienteId:      this.cliente().id,
      detalles:this.detalles
    }));
    Swal.fire({
      title: 'Espere por favor...',
      allowOutsideClick: false,
      icon: 'info',
    });
    Swal.showLoading();
    // Actualización: Utiliza la sintaxis de suscripción más reciente
    this._ventasService.create( this.factura()).subscribe({
      next: (resp) => {
       console.log(resp)
       Swal.close();
       Swal.fire('Factura guardada!!!', 'factura creada con exito!!! comprobante:'+resp.nroComprobante, 'success');
this.detalles=[];
this.factura.set({} as ModelCab);
      },
      error: (err) => {
        console.error(err);
        //Swal.fire("Error", err.msg, "error");
      },
    });
  }
}
