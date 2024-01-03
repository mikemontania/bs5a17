import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() productName: string = '';
  @Input() imageSrc: string = '';
  @Input() originalPrice: number = 0;
  @Input() discountedPrice: number = 0;

  onCardClick() {
    // Add your logic when the card is clicked
  }
}
