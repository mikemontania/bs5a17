import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewContainerRef,
  inject
} from "@angular/core";
import { debounceTime, distinctUntilChanged } from "rxjs";
import { InputDebounceComponent } from "../inputDebounce/inputDebounce.component";
import { Sucursal } from "../../interfaces/sucursal.interface";
import { SucursalService } from "../../services/service.index";
@Component({
  selector: "app-sucursal-search",
  standalone: true,
  imports: [CommonModule, InputDebounceComponent],
  templateUrl: "./ng-sucursal-search.component.html",
  styleUrl: "./ng-sucursal-search.component.css"
})
export class NgSucursalSearchComponent implements OnInit {
  size = "medium";
  delay = 200;
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() sucursal = new EventEmitter<Sucursal>();

  sucursales: Sucursal[] = [];
  sucursalesAux: Sucursal[] = [];
  _sucursalesService = inject(SucursalService);

  ngOnInit(): void {
    this.sucursales = [];

    this.buscar("");
  }

  selectSucursal(sucursal: Sucursal) {
    this.sucursal.emit(sucursal);
  }
  trackSucursal(index: number, sucursal: Sucursal): number {
    return sucursal.id; // Assuming sucursal has a unique ID
  }

  close() {
    this.closeModal.emit();
  }

  buscar(termino: string) {
      this._sucursalesService.findAll().subscribe(resp=> this.sucursalesAux=resp);
    console.log("sucursales aux", this.sucursalesAux);

    if (termino) {
      this.sucursalesAux = this.sucursalesAux.filter((sucursal: Sucursal) => {
        return sucursal.descripcion
          .toLowerCase()
          .includes(termino.toLowerCase());
      });
    }

    this.sucursales = this.sucursalesAux;
  }
}
