import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-incrementador',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './incrementador.component.html',
  styleUrl: './incrementador.component.css'
})
export class IncrementadorComponent {
  @Input() cantidad: number = 1;
  @Output() change = new EventEmitter<number>();
  cambiarValor(valor: number) {
    if (this.cantidad <= 0 && valor < 0) {
      this.cantidad = 0;
      return;
    }
    this.cantidad = this.cantidad + valor;
    this.change.emit(this.cantidad);
  }
  cambioValor() {
     this.change.emit(this.cantidad);
  }

}
