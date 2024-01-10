import { CommonModule } from "@angular/common";
import { Component,       EventEmitter, Input, OnInit, Output, inject } from "@angular/core";
import { InputDebounceComponent } from "../inputDebounce/inputDebounce.component";
import { ListaPrecio } from "../../interfaces/listaPrecio.interface";
import { ListaPrecioService } from "../../services/service.index";
@Component({
  selector: "app-lista-precio-search",
  standalone: true,
  imports: [CommonModule, InputDebounceComponent],
  templateUrl: "./ng-lista-precio-search.component.html",
  styleUrl: "./ng-lista-precio-search.component.css"
})
export class NgListaPrecioSearchComponent implements OnInit {
  size = "medium";
  delay = 200;
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() listaPrecio = new EventEmitter<ListaPrecio>();

  listasPrecio: ListaPrecio[] = [];
  listasPrecioAux: ListaPrecio[] = [];
  _listasPrecioService = inject(ListaPrecioService);

  ngOnInit(): void {
    this.listasPrecio = [];

    this.buscar("");
  }

  selectListaPrecio(listaPrecio: ListaPrecio) {
    this.listaPrecio.emit(listaPrecio);
  }
  trackListaPrecio(index: number, listaPrecio: ListaPrecio): number {
    return listaPrecio.id; // Assuming listaPrecio has a unique ID
  }

  close() {
    this.closeModal.emit();
  }

  buscar(termino: string) {
      this._listasPrecioService.findAll().subscribe(resp=> this.listasPrecioAux=resp);
    console.log("listasPrecio aux", this.listasPrecioAux);

    if (termino) {
      this.listasPrecioAux = this.listasPrecioAux.filter((listaPrecio: ListaPrecio) => {
        return listaPrecio.descripcion
          .toLowerCase()
          .includes(termino.toLowerCase());
      });
    }

    this.listasPrecio = this.listasPrecioAux;
  }
}
