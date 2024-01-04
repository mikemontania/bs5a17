import { Component } from "@angular/core";
import { SeccionClienteComponent } from "../../components/seccion-cliente/seccion-cliente.component";
import { InputDebounceComponent } from "../../components/inputDebounce/inputDebounce.component";
import { ProductCardComponent } from "../../components/product-card/product-card.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IncrementadorComponent } from "../../components/incrementador/incrementador.component";
import { NgClienteSearchComponent } from "../../components/ng-cliente-search/ng-cliente-search.component";

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
export class VentasComponent {
  cantidad: number = 0;
  searchCliente = false;

  abrirBuscador() {
    console.log(this.searchCliente)
    this.searchCliente = true;
    console.log(this.searchCliente)
  }

  cerrarBuscador() {
    this.searchCliente = false;
  }

  itemSeleccionado(item: any) {
    // Procesa el item seleccionado
    console.log('Item seleccionado:', item);
    this.cerrarBuscador(); // Cierra el modal al seleccionar un item
  }

  buscar(event: any) {}
}
