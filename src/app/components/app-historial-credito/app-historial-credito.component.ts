import { Component,   Output, EventEmitter,   Input,  OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { CreditosService } from '../../services/creditos.service';
export interface HistorialCredito {
  fecha: string; // e.g. "2025-04-09"
  fechaCreacion: string; // e.g. "2025-04-09 10:35:36"
  id: string; // podría ser number si siempre es numérico
  importe: string; // también podría ser number si lo convertís
  saldoAnterior: string;
  saldoNuevo: string;
  observacion: string;
  empresaId: number;
  creditoId: number;
  usuarioCreacionId: string;
  timbrado: string;
  nroComprobante: string;
}
@Component({
  standalone: true,
  imports: [CommonModule,],
  selector: 'app-historial-credito',
  styleUrl: "./app-historial-credito.component.css",
  templateUrl: './app-historial-credito.component.html',

  styles: []
})
export class HistorialCreditoComponent implements OnInit {
  size = "large";
  delay = 200;
  @Input() isOpen = false;
  @Input() id = 0;
  @Output() closeModal = new EventEmitter<void>();
  historialCredito: HistorialCredito[] = [];
  _creditoService = inject(CreditosService);

  ngOnInit(): void {
    this.historialCredito = [];

    this.buscar(this.id);
  }
  close() {
    this.closeModal.emit();
  }

  buscar(id: number) {
    if (id) {
      this._creditoService.getHistorial(id)
        .subscribe((response: any) => {
          console.log(response);
          this.historialCredito = response as HistorialCredito[];
        });

    }
  }

  formatNumberWithThousandsSeparator(value: number): string {
    // Primero, convertimos el valor a un número entero, y luego lo formateamos
    const number = Math.round(value); // Redondeamos el número si es necesario
    return number.toLocaleString('es-PY'); // Usamos el formato de Paraguay para separar miles con puntos
  }
}
