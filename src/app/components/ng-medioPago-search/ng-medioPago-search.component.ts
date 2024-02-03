import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject
} from "@angular/core";
import { InputDebounceComponent } from "../inputDebounce/inputDebounce.component";
import { MedioPagoService } from "../../services/service.index";
import { MedioPago } from "../../interfaces/facturas.interface";
@Component({
  selector: "app-medioPago-search",
  standalone: true,
  imports: [CommonModule, InputDebounceComponent],
  templateUrl: "./ng-medioPago-search.component.html",
  styleUrl: "./ng-medioPago-search.component.css"
})
export class NgMedioPagoSearchComponent implements OnInit {
  size = "medium";
  delay = 200;
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() medioPago = new EventEmitter<MedioPago>();

  medioPagos: MedioPago[] = [];
  medioPagosAux: MedioPago[] = [];
  _medioPagosService = inject(MedioPagoService);

  ngOnInit(): void {
    this.medioPagos = [];
    this._medioPagosService.findAll().subscribe(resp=> this.medioPagosAux=resp);
    console.log("medioPagos aux", this.medioPagosAux);
    this.buscar("");
  }

  selectMedioPago(medioPago: MedioPago) {
    this.medioPago.emit(medioPago);
  }
  trackMedioPago(index: number, medioPago: MedioPago): number {
    return medioPago.id; // Assuming medioPago has a unique ID
  }

  close() {
    this.closeModal.emit();
  }

  buscar(termino: string) {


    if (termino && termino != '') {
      this.medioPagosAux = this.medioPagosAux.filter((medioPago: MedioPago) => {
        return medioPago.descripcion
          .toLowerCase()
          .includes(termino.toLowerCase());
      });
    }else{
      this._medioPagosService.findAll().subscribe(resp=> this.medioPagosAux=resp);
    }

   // this.medioPagos = this.medioPagosAux;
  }
}
