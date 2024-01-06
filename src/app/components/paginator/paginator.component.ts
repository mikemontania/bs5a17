import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css'
})

  export class PaginatorComponent {
    @Input() totalPages: number = 1;
  @Input() currentPage: number = 1;
  @Output() pageChanged = new EventEmitter<number>();

  getPagesToShow(): number[] {
    const pagesToShow: number[] = [];
    const totalPagesToShow = 5; // Número total de páginas a mostrar

    // Establecer el rango de páginas para mostrar
    let startPage = Math.max(1, this.currentPage - Math.floor(totalPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + totalPagesToShow - 1);

    // Ajustar el rango si es necesario para tener el número total de páginasToShow
    if (endPage - startPage + 1 < totalPagesToShow) {
      startPage = Math.max(1, endPage - totalPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pagesToShow.push(i);
    }

    return pagesToShow;
  }

  onPageChange(page: number, event: Event): void {
    event.preventDefault(); // Previene el comportamiento predeterminado del enlace
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChanged.emit(page);
    }
  }

  goToFirstPage(event: Event): void {
    event.preventDefault();
    this.onPageChange(1, event);
  }

  goToLastPage(event: Event): void {
    event.preventDefault();
    this.onPageChange(this.totalPages, event);
  }

  }
