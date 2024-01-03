import { Component } from '@angular/core';
import { SeccionClienteComponent } from '../../components/seccion-cliente/seccion-cliente.component';
import { InputDebounceComponent } from '../../components/inputDebounce/inputDebounce.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [SeccionClienteComponent, InputDebounceComponent, ProductCardComponent],
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css'
})
export class VentasComponent {















  buscar(event:any){

  }
}
