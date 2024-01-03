import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-seccion-cliente',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './seccion-cliente.component.html',
  styleUrl: './seccion-cliente.component.css'
})
export class SeccionClienteComponent {
  ruc = 'Default RUC';
  razonsocial = 'Default Razon Social';

  constructor( ) {} // Inyecta el servicio NgbModal

  openSearchModal() {
    // Aquí deberías implementar la lógica para abrir el modal de búsqueda de clientes
    // Utiliza el servicio NgbModal para abrir el modal correspondiente
    console.log('Abrir modal de búsqueda');
  }

  openCreateModal() {
    // Aquí deberías implementar la lógica para abrir el modal de creación de clientes
    // Utiliza el servicio NgbModal para abrir el modal correspondiente
    console.log('Abrir modal de creación de cliente');
  }
}
