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
import { Numeracion } from "../../interfaces/numeracion.interface";
import { NumeracionService } from "../../services/service.index";

@Component({
  selector: "app-numeracion-search",
  standalone: true,
  imports: [CommonModule, InputDebounceComponent],
  templateUrl: "./ng-numeracion-search.component.html",
  styleUrl: "./ng-numeracion-search.component.css"
})
export class NgNumeracionSearchComponent implements OnInit {
  size = "medium";
  delay = 200;
  @Input() isOpen = false;
  @Input() sucursalId = 0;
  @Output() closeModal = new EventEmitter<void>();
  @Output() numeracion = new EventEmitter<Numeracion>();

  numeraciones: Numeracion[] = [];
  numeracionesAux: Numeracion[] = [];
  _numeracionesService = inject(NumeracionService);

  ngOnInit(): void {
    this.numeraciones = [];

    this.buscar("");
  }

  selectNumeracion(numeracion: Numeracion) {
    this.numeracion.emit(numeracion);
  }
  trackNumeracion(index: number, numeracion: Numeracion): number {
    return numeracion.id; // Assuming numeracion has a unique ID
  }

  close() {
    this.closeModal.emit();
  }

  buscar(termino: string) {
    this._numeracionesService
      .findAll(this.sucursalId)
      .subscribe(resp => (this.numeracionesAux = resp));
    console.log("numeraciones aux", this.numeracionesAux);

    if (termino) {
      this.numeracionesAux = this.numeracionesAux.filter(
        (numeracion: Numeracion) => {
          return numeracion.serie.toLowerCase().includes(termino.toLowerCase());
        }
      );
    }

    this.numeraciones = this.numeracionesAux;
  }
}
