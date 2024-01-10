import { CommonModule } from "@angular/common";
import { Component,       EventEmitter, Input, OnInit, Output, ViewContainerRef, inject } from "@angular/core";
import { debounceTime, distinctUntilChanged } from "rxjs";
import { InputDebounceComponent } from "../inputDebounce/inputDebounce.component";
import { Cliente } from '../../interfaces/clientes.interface';
import { ClientesService } from "../../services/clientes.service";

@Component({
  selector: "app-numeracion-search",
  standalone: true,
  imports: [CommonModule, InputDebounceComponent],
  templateUrl: "./ng-numeracion-search.component.html",
  styleUrl: "./ng-numeracion-search.component.css"
})
export class NgNumeracionSearchComponent implements OnInit {
  size = "medium";
  delay=200;
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() cliente = new EventEmitter<Cliente>();

  clientes: Cliente[] = [];
  _clientesService = inject(ClientesService);

  ngOnInit(): void {
    this.clientes =[];

    this.buscar('');
  }


selectCliente(cliente: Cliente) {
  this.cliente.emit(cliente);

}
trackCliente(index: number, cliente: Cliente): number {
  return cliente.id; // Assuming cliente has a unique ID
}


  close() {
    this.closeModal.emit();
  }

  buscar(termino: string) {

    this._clientesService.searchClientes(1, 10, termino)
    .pipe(debounceTime(1500), distinctUntilChanged())
    .subscribe((response: any) => {
      console.log(response);
      this.clientes = response.rows as Cliente[];
    });
    /*   debounceTime(300);
    distinctUntilChanged(); */
    console.log(termino);
  }
}
