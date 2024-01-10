import { CommonModule } from "@angular/common";
import { Component,       EventEmitter, Input, OnInit, Output,  inject } from "@angular/core";
import { InputDebounceComponent } from "../inputDebounce/inputDebounce.component";
import { FormaVentaService } from "../../services/service.index";
import { FormaVenta } from "../../interfaces/formaventa.interface";

@Component({
  selector: "app-forma-venta-search",
  standalone: true,
  imports: [CommonModule, InputDebounceComponent],
  templateUrl: "./ng-forma-venta-search.component.html",
  styleUrl: "./ng-forma-venta-search.component.css"
})
export class NgFormaVentaSearchComponent implements OnInit {
  size = "medium";
  delay = 200;
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() formaVenta = new EventEmitter<FormaVenta>();

  formasVenta: FormaVenta[] = [];
  formasVentaAux: FormaVenta[] = [];
  _formasVentaService = inject(FormaVentaService);

  ngOnInit(): void {
    this.formasVenta = [];

    this.buscar("");
  }

  selectFormaVenta(formaVenta: FormaVenta) {
    this.formaVenta.emit(formaVenta);
  }
  trackFormaVenta(index: number, formaVenta: FormaVenta): number {
    return formaVenta.id; // Assuming formaVenta has a unique ID
  }

  close() {
    this.closeModal.emit();
  }

  buscar(termino: string) {
      this._formasVentaService.findAll().subscribe(resp=> this.formasVentaAux=resp);
    console.log("formasVenta aux", this.formasVentaAux);

    if (termino) {
      this.formasVentaAux = this.formasVentaAux.filter((formaVenta: FormaVenta) => {
        return formaVenta.descripcion
          .toLowerCase()
          .includes(termino.toLowerCase());
      });
    }

    this.formasVenta = this.formasVentaAux;
  }
}
