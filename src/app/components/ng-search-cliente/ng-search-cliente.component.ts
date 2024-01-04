import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
 import { FormsModule } from '@angular/forms';
import { ClientesService } from '../../services/clientes.service';
import { InputDebounceComponent } from '../inputDebounce/inputDebounce.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ng-search-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule, InputDebounceComponent],
  templateUrl: './ng-search-cliente.component.html',
  styleUrl: './ng-search-cliente.component.css'
})
export class NgSearchClienteComponent {
  @Input() placeholder: string = '';
  @Input() delay: number = 1000;
  @Output() itemSeleccionado: EventEmitter<any> = new EventEmitter();
  @Input() isModalVisible: boolean =false;

  items: any[] = [];
  _clienteService = inject(ClientesService)
constructor(){console.log('asdasas')}
  obtenerItems(busqueda: string) {
    this._clienteService.searchClientes(1, 10, busqueda)
    .subscribe((items:any[])=> {
      this.items = items;
    });
  }

  seleccionarItem(item: any) {
    this.itemSeleccionado.emit(item);
    this.cerrarModal(); // Cierra el modal
  }

  cerrarModal() {
    this.isModalVisible = false;

  }
}
