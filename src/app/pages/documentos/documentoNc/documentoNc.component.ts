import { Documento, DocumentoDetalle } from './../../../interfaces/facturas.interface';
import { Component, OnInit, computed, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import {
  DocumentosService,
} from "../../../services/service.index";
import Swal from "sweetalert2";
import { ActivatedRoute, Router } from '@angular/router';
import { ImagenPipe } from "../../../pipes/imagen.pipe";
import { CheckToggleComponent } from '../../../components/check-toggle/check-toggle.component';
import { AuthService } from '../../../auth/services/auth.service';
import { motivosNotaCredito } from '../../../interfaces/motivosNotaCred';
import { Location } from '@angular/common';

@Component({
  selector: "app-docNc",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ImagenPipe, CheckToggleComponent
  ],
  templateUrl: "./documentoNc.component.html",
  styleUrl: "./documentoNc.component.css"
})
export class DocumentoNcComponent implements OnInit {
  private _router = inject(Router);
  private _documentosService = inject(DocumentosService);
  private activatedRoute = inject(ActivatedRoute);
  private _authService = inject(AuthService);
  private location= inject(Location)
  importeAnterior:number=0;
   factura: Documento = {} as Documento; // Almacenará la información de la documento
  detalles: any[] = [];
motivos = motivosNotaCredito;
  constructor() { }

  ngOnInit(): void {
    if (!this._authService.numeracionNotaCredId()) {
      Swal.fire("Atención", "Acceso denegado!!", "error");
      this._router.navigate(['/dashboard']);
    }
    this.activatedRoute.paramMap.subscribe(params => {
      let id = params.get('id') ?? 0; // Maneja la posibilidad de valor nulo
      console.log(id)
      if (id) {
        this._documentosService.getById(+id).subscribe({
          next: (resp) => {
            console.log(resp)
            if (resp.documento?.anulado == true) {
              Swal.fire("Atención", "Documento anulado!! no se puede aplicar Nota de credito", "error");
              this._router.navigate(['/documentos/listar']);
              return; // Detiene la ejecución del resto del código, evitando que se lea la siguiente condición
            }

            if (resp.documento?.calculable == false) {
              Swal.fire("Atención", "Documento NO calculable!!, Documento podría tener documento hijo o ha sido compensado", "error");
              this._router.navigate(['/documentos/listar']);
              return; // Detiene la ejecución si el documento no es calculable
            }

            if (resp.documento?.calculable == false && resp.documento?.anulado == false) {
              Swal.fire("Atención", "Documento NO calculable!!, Documento podría tener documento hijo o ha sido compensado", "error");
              this._router.navigate(['/documentos/listar']);
              return; // Salir del método para evitar que se realicen más operaciones
            }
            this.factura = {...resp.documento,idMotEmi:1}; // Guarda la respuesta en la propiedad documento
            this.importeAnterior = +resp.documento.importeTotal;
            if (resp.detalles && resp.detalles.length > 0) {
              this.detalles = resp.detalles.map((det: DocumentoDetalle) => ({
                ...det,
                isSelected: true,
                id: null,
                documentoId:null,
                ivaBase : 100,
                ivaTipo : 1,
                //solo puede ajustar cantidad hasta el cantidadMax
                //y disminuir hasta 1 o desmarcarlo
                cantidad: +det.cantidad,
                cantidadMax: +det.cantidad,
                importePrecio: +det.importePrecio,
                importeIva5: +det.importeIva5,
                importeIva10: +det.importeIva10,
                importeIvaExenta: +det.importeIvaExenta,
                importeDescuento: +det.importeDescuento,
                importeNeto: +det.importeNeto,
                importeSubtotal: +det.importeSubtotal,
                importeTotal: +det.importeTotal,
                porcDescuento: +det.porcDescuento || 0,
                peso: +det.variante.presentacion?.size ||0,
                totalKg: (+det.variante.presentacion?.size ||0)* +det.cantidad,
              }));
            }
          },
          error: (er) => {
            console.error(er);
            Swal.fire("Atención", "No se pudo obtener información de la factura", "error");
            this._router.navigate(['/dashboard']);
          }
        });
      }
    });
  }



  toggleIncluir(index: number) {
    this.detalles[index].isSelected = !this.detalles[index].isSelected;
    console.log(this.detalles[index])
    if (!this.detalles[index].isSelected) {
      // Si se desmarca, se ponen todos los valores a 0 para evitar sumarlos
      this.detalles[index].importeSubtotal = 0;
      this.detalles[index].importeTotal = 0;
      this.detalles[index].importeDescuento = 0;
      this.detalles[index].importeIva5 = 0;
      this.detalles[index].importeIva10 = 0;
      this.detalles[index].importeIvaExenta = 0;
      this.detalles[index].totalKg = 0;
    } else {
      console.log(this.detalles[index])
      // Si se marca nuevamente, recalculamos los valores originales
      this.detalles[index].importeSubtotal = this.detalles[index].cantidad * this.detalles[index].importePrecio;
      this.detalles[index].importeDescuento = Math.round(this.detalles[index].importeSubtotal * (this.detalles[index].porcDescuento / 100));
      this.detalles[index].importeTotal = this.detalles[index].importeSubtotal - this.detalles[index].importeDescuento;

      let porcIva5 = this.detalles[index].porcIva === 5 ? Math.round(this.detalles[index].importeTotal / 21) : 0;
      let porcIva10 = this.detalles[index].porcIva === 10 ? Math.round(this.detalles[index].importeTotal / 11) : 0;
      let porcIvaExenta = this.detalles[index].porcIva === 0 ? this.detalles[index].importeTotal : 0;

      this.detalles[index].importeIva5 = porcIva5;
      this.detalles[index].importeIva10 = porcIva10;
      this.detalles[index].importeIvaExenta = porcIvaExenta;
    }

    this.calcularTotales();
  }
  /**
    * Calcula los valores totales de la nota de crédito.
    */
  calcularTotales() {
    console.log(this.detalles)
    //aparto solo los registros con isSelected true
    const detallesAux = this.detalles.filter((det: any) => det.isSelected === true);
    const totales = detallesAux.reduce(
      (acum, detalle) => {
        if (detalle.isSelected) { // Solo sumar si está isSelected
          acum.importeSubtotal += detalle.importeSubtotal;
          acum.importeTotal += detalle.importeTotal;
          acum.importeDescuento += detalle.importeDescuento;
          acum.importeIva5 += detalle.importeIva5;
          acum.importeIva10 += detalle.importeIva10;
          acum.importeIvaExenta += detalle.importeIvaExenta;
        }
        return acum;
      },
      { importeSubtotal: 0, importeTotal: 0, importeDescuento: 0, importeIva5: 0, importeIva10: 0, importeIvaExenta: 0 }
    );

    // Actualizar los valores en la cabecera
    this.factura.importeSubtotal = totales.importeSubtotal;
    this.factura.importeTotal = totales.importeTotal;
    this.factura.importeDescuento = totales.importeDescuento;
    this.factura.importeIva5 = totales.importeIva5;
    this.factura.importeIva10 = totales.importeIva10;
    this.factura.importeIvaExenta = totales.importeIvaExenta;
  }
  ajusteCantidad(indice: number, valor: number) {
    if (this.detalles[indice].isSelected == false) return;
    if (valor == 1 && this.detalles[indice].cantidad >= this.detalles[indice].cantidadMax) return;
    if (valor == -1 && this.detalles[indice].cantidad == 1) return;

    this.detalles[indice].cantidad += valor;
     console.log('peso',this.detalles[indice].peso)
    this.detalles[indice].totalKg = this.detalles[indice].cantidad * this.detalles[indice].peso;
    this.detalles[indice].importeSubtotal = this.detalles[indice].cantidad * this.detalles[indice].importePrecio;

    if (this.detalles[indice].porcDescuento) {
      this.detalles[indice].importeDescuento = Math.round(this.detalles[indice].importeSubtotal * this.detalles[indice].porcDescuento / 100);
    }

    this.detalles[indice].importeTotal = this.detalles[indice].importeSubtotal - this.detalles[indice].importeDescuento;

    let porcIva = this.detalles[indice].porcIva;
    let porcIva5 = porcIva === 5 ? Math.round(this.detalles[indice].importeTotal / 21) : 0;
    let porcIva10 = porcIva === 10 ? Math.round(this.detalles[indice].importeTotal / 11) : 0;
    let porcIvaExenta = porcIva === 0 ? this.detalles[indice].importeTotal : 0;
    let porcNeto = this.detalles[indice].importeTotal - (porcIva5 + porcIva10);

    this.detalles[indice].importeIva5 = porcIva5;
    this.detalles[indice].importeIva10 = porcIva10;
    this.detalles[indice].importeIvaExenta = porcIvaExenta;
    this.detalles[indice].importeNeto = porcNeto;

    this.calcularTotales(); // Recalcular totales
  }

  async guardarNotaCredito() {
  Swal.fire({
      title: 'Está seguro que deseas guardar el Documento NC?.',
      text: `Guardar Nota de Credito`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, guardar',
      cancelButtonText: 'No, Seguir',
      customClass: {
        confirmButton: 'btn btn-outline-success',  // Clase personalizada para el botón de confirmación
        cancelButton: 'btn btn-outline-danger'    // Clase personalizada para el botón de cancelación
      },
      buttonsStyling: false,
      reverseButtons: true
    }).then(async (result) => {
      if (result.value) {
        if (!this.factura) return;
              const detalles =   this.detalles
              .filter((det: any) => det.isSelected) // Filtra solo los seleccionados
              .map((det: any) => ({
                ivaBase : 100,
                ivaTipo : 1,
                varianteId: det.varianteId,
                cantidad: det.cantidad,
                importePrecio: det.importePrecio,
                importeIva5: det.importeIva5,
                importeIva10: det.importeIva10,
                importeIvaExenta: det.importeIvaExenta,
                importeDescuento: det.importeDescuento,
                porcIva:det.porcIva,
                importeNeto: det.importeNeto,
                importeSubtotal: det.importeSubtotal,
                importeTotal: det.importeTotal,
                porcDescuento: det.porcDescuento,
                totalKg: det.totalKg,
                tipoDescuento: det.tipoDescuento,
                variante: det.variante,
              }));
             let porcDescuento =0
              if ( this.factura.importeDescuento > 0 ) {
                porcDescuento = (this.factura.importeDescuento/this.factura.importeSubtotal)*100;
              }
        const notaCredito: any = {
          docAsociadoId:this.factura.id,
          cdcAsociado:this.factura.cdc,
           sucursalId:this.factura.sucursalId,
           numeracionNotaCredId:this._authService.numeracionNotaCredId(),
           listaPrecioId:this.factura.listaPrecioId,
           condicionPagoId:this.factura.condicionPagoId,
           clienteId:this.factura.clienteId,
           detalles,
           totalKg:this.factura.totalKg,
           importeNeto: this.factura.importeNeto,
           importeSubtotal : this.factura.importeSubtotal,
           importeTotal : this.factura.importeTotal,
           importeDescuento : this.factura.importeDescuento,
           importeIva5 : this.factura.importeIva5,
           importeIva10 : this.factura.importeIva10,
           importeIvaExenta : this.factura.importeIvaExenta,
           porcDescuento:porcDescuento,
           importeAnterior:this.importeAnterior,
           importeDevuelto:                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    this.factura.importeTotal-this.importeAnterior,
           idMotEmi:this.factura.idMotEmi

        };

        try {
          console.log(notaCredito)
          await this._documentosService.createNc(notaCredito).toPromise();
          Swal.fire("Éxito", "Nota de Crédito guardada correctamente", "success").then(() => {
            this._router.navigate(["/dashboard"]);
          });
        } catch (error) {
          Swal.fire("Error", "No se pudo guardar la Nota de Crédito", "error");
        }

        }

    })







  }

  volverAtras() {
    this.location.back();
  }
  cancelar() {
    this._router.navigate(["/dashboard"]);
  }
}
