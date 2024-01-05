import { Component, OnInit, inject, signal } from "@angular/core";
import { SeccionClienteComponent } from "../../components/seccion-cliente/seccion-cliente.component";
import { InputDebounceComponent } from "../../components/inputDebounce/inputDebounce.component";
import { ProductCardComponent } from "../../components/product-card/product-card.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IncrementadorComponent } from "../../components/incrementador/incrementador.component";
import { NgClienteSearchComponent } from "../../components/ng-cliente-search/ng-cliente-search.component";
import { Cliente } from "../../interfaces/clientes.interface";
import { ClientesService } from "../../services/clientes.service";

@Component({
  selector: "app-ventas",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SeccionClienteComponent,
    InputDebounceComponent,
    ProductCardComponent,
    IncrementadorComponent,
    NgClienteSearchComponent
  ],
  templateUrl: "./ventas.component.html",
  styleUrl: "./ventas.component.css"
})
export class VentasComponent implements OnInit{
  cantidad: number = 0;
  searchCliente = false;
   cliente = signal<Cliente>({nroDocumento:'', razonSocial:''} as Cliente);

   _clienteService = inject(ClientesService);
constructor(){
  this._clienteService.findPredeterminado().subscribe(resp =>this.cliente.set(resp) );

}

  ngOnInit(){

  }

  abrirBuscador() {
    console.log(this.searchCliente)
    this.searchCliente = true;
    console.log(this.searchCliente)
  }



  selectCliente(cliente: Cliente) {
    // Process the selected client
    console.log('Selected client:', cliente);
    this.cliente.set(cliente); // Update the client signal
    this.searchCliente = false; // Close the modal
  }
  buscar(event: any) {}
}