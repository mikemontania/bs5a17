
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputDebounceComponent } from '../../../components/inputDebounce/inputDebounce.component';
import { PaginatorComponent } from '../../../components/paginator/paginator.component';
import { ClientesPage } from '../../../interfaces/pages.interfaces';
import { ClientesService } from '../../../services/clientes.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, InputDebounceComponent, PaginatorComponent,],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent {
  searchTerm = signal<string>('');
  clientesPage = signal<ClientesPage>({} as ClientesPage);
  page = signal<number>(1);
  totalPages = signal<number>(1);
  pageSize = signal<number>(10);

  clientes = computed(() => this.clientesPage().clientes ?? []);

  private _router = inject(Router)
  _clientesService = inject(ClientesService);
  constructor() {
    const storedSearchData = localStorage.getItem('searchClienteData');

    if (storedSearchData) {
      try {
        const parsedData = JSON.parse(storedSearchData);
        this.searchTerm.set(parsedData.searchTerm);
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
  debounceSearch(event: any) {
    this.searchTerm.set(event);
    this.getPage(1); // Reset to first page on search
  }
  getPage(page: number) {

    this.page.set(page);

    localStorage.setItem('searchClienteData', JSON.stringify({
      searchTerm: this.searchTerm(),
      page: this.page(),
      pageSize: this.pageSize(),
    }));

    this._clientesService
      .search(this.page(),  this.pageSize(), this.searchTerm())
      .subscribe({
        next: (resp) => {
          this.clientesPage.set(resp);
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


  verCliente(clienteId: number) {
    this._router.navigate(['/clientes', 'cliente', clienteId]);

  }
  agregar() {
    this._router.navigate(['/clientes/cliente' ]);
  }
  cancelar() {

    try {

      this.searchTerm.set('');
      this.page.set(1);
      this.pageSize.set(10);

    } catch (error) {
      console.error('Error parsing stored search data:', error);
    }

  }



}
