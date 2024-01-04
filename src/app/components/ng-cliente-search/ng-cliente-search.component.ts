import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output, inject } from "@angular/core";
import { debounceTime, distinctUntilChanged } from "rxjs";
import { InputDebounceComponent } from "../inputDebounce/inputDebounce.component";
import { Cliente } from '../../interfaces/clientes.interface';
import { ClientesService } from "../../services/clientes.service";

@Component({
  selector: "app-cliente-search",
  standalone: true,
  imports: [CommonModule, InputDebounceComponent],
  templateUrl: "./ng-cliente-search.component.html",
  styleUrl: "./ng-cliente-search.component.css"
})
export class NgClienteSearchComponent {
  size = "medium";
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  clienteSelecionado:Cliente={}as Cliente;
  clientes: Cliente[] = [];
_clientesService = inject(ClientesService);


constructor(){
  this.clientes = []
  this.buscar('')
}
  close() {
    this.closeModal.emit();
  }

  buscar(termino: string) {

    this._clientesService.searchClientes(1, 10, termino)
    .pipe(debounceTime(3000), distinctUntilChanged())
    .subscribe((response: any) => {
      console.log(response);
      this.clientes = response.rows as Cliente[];
    });
    /*   debounceTime(300);
    distinctUntilChanged(); */
    console.log(termino);
  }
}
