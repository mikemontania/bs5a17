import { Component, Input } from '@angular/core';
import { ProductosItem } from '../../interfaces/productoItem.inteface';
import { ImagenPipe } from '../../pipes/imagen.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule,ImagenPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {

  @Input() producto: ProductosItem = {} as ProductosItem;
  @Input() precio: number = 0;
  @Input() descuento: number = 0;
  get formattedDescription(): string {
    const description = `${this.producto.producto} ${this.producto.presentacion} ${this.producto.variedad}`;

    if (description.length === 0) {
      return 'Sin descripción';
    }

    if (description.length > 78) {
      return description.substring(0, 78) + '...';
    }

    return description;
  }

  onCardClick() {
    // Add your logic when the card is clicked
  }
}
