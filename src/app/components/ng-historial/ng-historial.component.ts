import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, computed, inject, signal } from "@angular/core";
import {   FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { forkJoin, of } from "rxjs";
import { SifenService, VentasService } from "../../services/service.index";
import Swal from "sweetalert2";

@Component({
  selector: "app-historial",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,],
  templateUrl: "./ng-historial.component.html",
  styleUrl: "./ng-historial.component.css"
})
export class NgHistorialComponent implements OnInit {
  size = "large";
  delay = 200;
  @Input() venta: any = null;
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() stateChanged = new EventEmitter<any>();
  // Observables
  historialXml: any[] = [];
  private _sifenService = inject(SifenService);
  private _ventaService = inject(VentasService);

  constructor() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['venta'] && this.venta?.id > 0) {
      console.log(this.venta);
      forkJoin([this._ventaService.historialXml(this.venta.id)]).subscribe(([ventasXml]) => {
        console.log(ventasXml);
        this.historialXml = ventasXml;
      });
    }
  }

  ngOnInit(): void {

  }
  close() {
    this.closeModal.emit();
  }

  generateKude(id:number ) {
      this._sifenService.getKude(id).subscribe((response: any) => {
        const fileURL = URL.createObjectURL(response);
        window.open(fileURL, '_blank');
      })
  }


  reintentar() {
    this._sifenService.reintentarSifen(this.venta.id)
      .subscribe({
        next: (resp) => {
          Swal.fire('Respuesta', resp.data, 'success');
        },
        error: message => {
          Swal.fire('Error', message.error, 'error');
        }
      });

  }

  concultarCDC() {
    this._sifenService.consultaCDC(this.venta.id, this.venta.cdc).subscribe((response: any) => {
      console.log(response);
      this.venta.anulado =response.venta.anulado;
      this.venta.estado = response.venta.estado;
      this.stateChanged.emit(this.venta);
      Swal.fire('Respuesta', 'Nuevo estado '+response.venta.estado, 'success');

    })

  }

  anularSifen() {
    Swal.fire({
      title: 'Está segur@ que desea inutilizar/cancelar la factura?',
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

        let tipoId = 2;
        // si this.venta.estado in( Pendiente, Rechazado, Recibido) entonces tipo 2 que es inutilizar
        // si this.venta.estado in( Aprobado, RechazInutilizado) entonces tipo 1 que es inutilizar

        if (['Aprobado', 'RechazInutilizado'].includes(this.venta.estado)) {
          tipoId = 1; // Inutilizar
        } else if (['Pendiente', 'Rechazado', 'Recibido'].includes(this.venta.estado)) {
          tipoId = 2; // Anular
        }
        this._sifenService.anulacionSifen(this.venta.id, tipoId).subscribe((data: any) => {
        this.venta.anulado =data.venta.anulado;
        this.venta.estado = data.venta.estado;
        this.stateChanged.emit(this.venta);  // Enviar la venta actualizada al padre


          Swal.fire('Factura anulada!!!', 'factura anulada con exito!!! comprobante:', 'success');

        })
      }
    });
  }


  verXml(item: any) {
    const xmlString = new TextDecoder().decode(new Uint8Array(item.xml.data)); // Convertir Buffer a String

    const blob = new Blob([xmlString], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);

    // Abrir en otra pestaña
    window.open(url, '_blank');
  }

}
