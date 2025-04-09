// resumen-credito.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resumen-credito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-resumen-credito.component.html',
})
export class ResumenCreditoComponent {
  @Input() resumen!: any;
  @Input() titulo: string = '';
}
