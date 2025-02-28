import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output,   SimpleChanges,   computed, inject, signal } from "@angular/core";
import { FormBuilder,  FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import {  forkJoin, of } from "rxjs";
import moment from "moment";
import { VentasService } from "../../services/ventas.service";

@Component({
  selector: "app-historial",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ],
  templateUrl: "./ng-historial.component.html",
  styleUrl: "./ng-historial.component.css"
})
export class NgHistorialComponent implements OnInit {
  size = "large";
  delay = 200;
  @Input() id = 0;
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  // Observables
  historialXml: any[] = [];



  private _ventaService = inject(VentasService);

  constructor() {
    // Initialize the property in the constructor
  /*   if (this.id >0) {
      forkJoin([
        this._ventaService.historialXml(this.id)
      ]).subscribe(([ventasXml]) => {
        console.log(ventasXml);
        this.historialXml = ventasXml;
      });
    } */
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id'] && this.id > 0) {
      forkJoin([this._ventaService.historialXml(this.id)]).subscribe(([ventasXml]) => {
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
  verXml(item: any) {
    const xmlString = new TextDecoder().decode(new Uint8Array(item.xml.data)); // Convertir Buffer a String

    const blob = new Blob([xmlString], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);

    // Abrir en otra pestaña
    window.open(url, '_blank');
  }

}
