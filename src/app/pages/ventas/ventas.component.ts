import { Component } from "@angular/core";
import { SeccionClienteComponent } from "../../components/seccion-cliente/seccion-cliente.component";
import { InputDebounceComponent } from "../../components/inputDebounce/inputDebounce.component";
import { ProductCardComponent } from "../../components/product-card/product-card.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IncrementadorComponent } from "../../components/incrementador/incrementador.component";

@Component({
  selector: "app-ventas",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SeccionClienteComponent,
    InputDebounceComponent,
    ProductCardComponent,
    IncrementadorComponent
  ],
  templateUrl: "./ventas.component.html",
  styleUrl: "./ventas.component.css"
})
export class VentasComponent {
  cantidad: number = 0;
  buscar(event: any) {}
}
