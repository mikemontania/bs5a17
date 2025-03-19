import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, computed, inject, signal } from "@angular/core";
import {   FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { forkJoin, of } from "rxjs";
import { SifenService,DocumentosService } from "../../services/service.index";
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
  @Input() documento: any = null;
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() stateChanged = new EventEmitter<any>();
  // Observables
  historialXml: any[] = [];
  private _sifenService = inject(SifenService);
  private _documentoService = inject(DocumentosService);

  constructor() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['documento'] && this.documento?.id > 0) {
      console.log(this.documento);
      forkJoin([this._documentoService.historialXml(this.documento.id)]).subscribe(([documentosXml]) => {
        console.log(documentosXml);
        this.historialXml = documentosXml;
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
    this._sifenService.reintentarSifen(this.documento.id)
      .subscribe({
        next: (resp) => {
          console.log(resp);
          this.documento.anulado = resp.documento.anulado;
          this.documento.estado = resp.documento.estado;
          this.stateChanged.emit(this.documento);
          Swal.fire('Respuesta', resp.mensaje, 'success');
        },
        error: message => {
          Swal.fire('Error', message.error, 'error');
        }
      });

  }

  concultarCDC() {
    this._sifenService.consultaCDC(this.documento.id, this.documento.cdc).subscribe((response: any) => {
      console.log(response);
      this.documento.anulado =response.documento.anulado;
      this.documento.estado = response.documento.estado;
      this.stateChanged.emit(this.documento);
      Swal.fire('Respuesta', 'Nuevo estado '+response.documento.estado, 'success');

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
        // si this.documento.estado in( Pendiente, Rechazado, Recibido) entonces tipo 2 que es inutilizar
        // si this.documento.estado in( Aprobado, RechazInutilizado) entonces tipo 1 que es inutilizar

        if (['Aprobado', 'RechazInutilizado'].includes(this.documento.estado)) {
          tipoId = 1; // Inutilizar
        } else if (['Pendiente', 'Rechazado', 'Recibido'].includes(this.documento.estado)) {
          tipoId = 2; // Anular
        }
        this._sifenService.anulacionSifen(this.documento.id, tipoId).subscribe((data: any) => {
        this.documento.anulado =data.documento.anulado;
        this.documento.estado = data.documento.estado;
        this.stateChanged.emit(this.documento);  // Enviar la documento actualizada al padre


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
