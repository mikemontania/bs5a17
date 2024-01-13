import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductosItem } from '../../interfaces/productoItem.inteface';
import { ImagenPipe } from '../../pipes/imagen.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, ImagenPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Output() productClicked = new EventEmitter<ProductosItem>();
  @Input() producto: ProductosItem = {} as ProductosItem;
  get formattedDescription(): string {
    const capitalizeFirstLetter = (word: string) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    };

    const capitalizeAllWords = (text: string) => {
      return text.split(' ').map(capitalizeFirstLetter).join(' ');
    };

    const description = `${capitalizeAllWords(this.producto.producto)} ${capitalizeAllWords(this.producto.variedad)} ${capitalizeAllWords(this.producto.presentacion)}`;

    if (description.trim().length === 0) {
      return 'Sin descripción';
    }

    if (description.length > 78) {
      return description.substring(0, 78) + '...';
    }

    return description;
  }

  onCardClick() {
    console.log(this.producto)
    this.productClicked.emit(this.producto);
  }
}
