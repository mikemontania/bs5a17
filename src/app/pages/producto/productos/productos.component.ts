import { CommonModule } from "@angular/common";
import { Component,   } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { EntidadesComponent } from "../../../components/entidad/entidades/entidades.component";
import { ProductoComponent } from "../producto/producto.component";


@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule,ProductoComponent, EntidadesComponent  ],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent {

  tabActivo: string = 'productos-tab'; // Inicializar con el ID del tab 'productos'

  constructor() {}

  cambiarTab(tabId: string) {
    this.tabActivo = tabId;
  }
}
