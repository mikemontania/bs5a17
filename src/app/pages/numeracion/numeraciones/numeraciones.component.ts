
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputDebounceComponent } from '../../../components/inputDebounce/inputDebounce.component';
import { PaginatorComponent } from '../../../components/paginator/paginator.component';
import { NumeracionesPage } from '../../../interfaces/pages.interfaces';
import { NumeracionService } from '../../../services/service.index';

@Component({
  selector: 'app-numeraciones',
  standalone: true,
  imports: [CommonModule, FormsModule,  PaginatorComponent,],
  templateUrl: './numeraciones.component.html',
  styleUrl: './numeraciones.component.css'
})
export class NumeracionesComponent {
  numeracionesPage = signal<NumeracionesPage>({} as NumeracionesPage);
  page = signal<number>(1);
  totalPages = signal<number>(1);
  pageSize = signal<number>(10);

  numeraciones = computed(() => this.numeracionesPage().numeraciones ?? []);

  private _router = inject(Router)
  _numeracionesService = inject(NumeracionService);
  constructor() {
    const storedSearchData = localStorage.getItem('searchNumeracionData');

    if (storedSearchData) {
      try {
        const parsedData = JSON.parse(storedSearchData);
        this.page.set(parsedData.page);
        this.pageSize.set(parsedData.pageSize);

      } catch (error) {
        console.error('Error parsing stored search data:', error);
      }
    }
  }
  ngOnInit() {
    this.buscar();
  }
  buscar() {

    this.getPage(this.page()); // Reset to first page on search
  }

  getPage(page: number) {

    this.page.set(page);

    localStorage.setItem('searchNumeracionData', JSON.stringify({
      page: this.page(),
      pageSize: this.pageSize(),
    }));

    this._numeracionesService
      .paginado(this.page(),  this.pageSize() )
      .subscribe({
        next: (resp) => {
          this.numeracionesPage.set(resp);
          console.log(resp)
          this.page.set(resp.page);
          this.totalPages.set(resp.totalPages);
        },
        error: message => {
          console.error(message)
        }
      });




  }


  onPageChanged(newPage: number) {
    this.getPage(newPage);
  }


  verNumeracion(numeracionId: number) {
    this._router.navigate(['/numeraciones', 'numeracion', numeracionId]);

  }
  agregar() {
    this._router.navigate(['/numeraciones/numeracion' ]);
  }
  cancelar() {

    try {

      this.page.set(1);
      this.pageSize.set(10);

    } catch (error) {
      console.error('Error parsing stored search data:', error);
    }

  }



}
