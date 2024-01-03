import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() producto: string = '';
  @Input() imageSrc: string = '';
  @Input() precio: number = 0;
  @Input() descuento: number = 0;

  onCardClick() {
    // Add your logic when the card is clicked
  }
}
