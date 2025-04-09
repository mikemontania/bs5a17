import { CommonModule } from "@angular/common";
import { Component,       EventEmitter, Input, OnInit, Output, ViewContainerRef, inject } from "@angular/core";
 import { InputDebounceComponent } from "../inputDebounce/inputDebounce.component";

@Component({
  selector: "app-estado-credito",
  standalone: true,
  imports: [CommonModule, InputDebounceComponent],
  templateUrl: "./ng-estado-search.component.html",
  styleUrl: "./ng-estado-search.component.css"
})
export class NgEstadoCreditoSearchComponent implements OnInit {
  size = "medium";
  delay = 200;
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() estado = new EventEmitter<any>();

  estados: any[] = [
    { id: 'TODOS', descripcion: 'TODOS' },
    { id: 'VENCIDO', descripcion: 'VENCIDO' },
    { id: 'PENDIENTE', descripcion: 'PENDIENTE' },
    { id: 'PAGADO', descripcion: 'PAGADO' },
  ];

  filteredEstados: any[] = this.estados;

  ngOnInit(): void {
    this.filteredEstados = this.estados; // Inicializa con todos los estados
  }

  close() {
    this.closeModal.emit();
  }

  selectEstado(estado: any) {
    this.estado.emit(estado);
    this.close();
  }

  trackEstado(index: number, estado: any): number {
    return estado.id; // Asumiendo que 'estado' tiene un ID único
  }

  buscar(termino: string) {
    if (!termino) {
      this.filteredEstados = this.estados; // Si no hay término de búsqueda, mostrar todos los estados
    } else {
      this.filteredEstados = this.estados.filter(estado =>
        estado.descripcion.toLowerCase().includes(termino.toLowerCase())
      );
    }
  }
}
