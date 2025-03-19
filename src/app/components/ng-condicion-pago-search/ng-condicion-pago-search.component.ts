import { CommonModule } from "@angular/common";
import { Component,       EventEmitter, Input, OnInit, Output,  inject } from "@angular/core";
import { InputDebounceComponent } from "../inputDebounce/inputDebounce.component";
import { CondicionPagoService } from "../../services/service.index";
import { CondicionPago } from "../../interfaces/condicionPago.interface";

@Component({
  selector: "app-condicion-pago-search",
  standalone: true,
  imports: [CommonModule, InputDebounceComponent],
  templateUrl: "./ng-condicion-pago-search.component.html",
  styleUrl: "./ng-condicion-pago-search.component.css"
})
export class NgCondicionPagoSearchComponent implements OnInit {
  size = "medium";
  delay = 200;
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() condicionPago = new EventEmitter<CondicionPago>();

 condicionesPago: CondicionPago[] = [];
 condicionesPagoAux: CondicionPago[] = [];
  _condicionesPagoService = inject(CondicionPagoService);

  ngOnInit(): void {
    this.condicionesPago = [];

    this.buscar("");
  }

  selectCondicionPago(condicionPago: CondicionPago) {
    this.condicionPago.emit(condicionPago);
  }
  trackCondicionPago(index: number, condicionPago: CondicionPago): number {
    return condicionPago.id; // Assuming condicionPago has a unique ID
  }

  close() {
    this.closeModal.emit();
  }

  buscar(termino: string) {
      this._condicionesPagoService.findAll().subscribe(resp=> this.condicionesPagoAux=resp);
    console.log("condicionesPago aux", this.condicionesPagoAux);

    if (termino) {
      this.condicionesPagoAux = this.condicionesPagoAux.filter((condicionPago: CondicionPago) => {
        return condicionPago.descripcion
          .toLowerCase()
          .includes(termino.toLowerCase());
      });
    }

    this.condicionesPago = this.condicionesPagoAux;
  }
}
