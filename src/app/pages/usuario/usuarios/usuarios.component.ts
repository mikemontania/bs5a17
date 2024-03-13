
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputDebounceComponent } from '../../../components/inputDebounce/inputDebounce.component';
import { PaginatorComponent } from '../../../components/paginator/paginator.component';
import { UsuariosPage } from '../../../interfaces/pages.interfaces';
import { UsuariosService } from '../../../services/usuarios.service';
import { ImagenPipe } from '../../../pipes/imagen.pipe';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, InputDebounceComponent,ImagenPipe, PaginatorComponent,],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {
  searchTerm = signal<string>('');
  usuariosPage = signal<UsuariosPage>({} as UsuariosPage);
  page = signal<number>(1);
  totalPages = signal<number>(1);
  pageSize = signal<number>(10);

  usuarios = computed(() => this.usuariosPage().usuarios ?? []);

  private _router = inject(Router)
  _usuariosService = inject(UsuariosService);
  constructor() {
    const storedSearchData = localStorage.getItem('searchUsuarioData');

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

    localStorage.setItem('searchUsuarioData', JSON.stringify({
      searchTerm: this.searchTerm(),
      page: this.page(),
      pageSize: this.pageSize(),
    }));

    this._usuariosService
      .search(this.page(),  this.pageSize(), this.searchTerm())
      .subscribe({
        next: (resp) => {
          this.usuariosPage.set(resp);
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


  verUsuario(usuarioId: number) {
    this._router.navigate(['/usuarios', 'usuario', usuarioId]);

  }
  agregar() {
    this._router.navigate(['/usuarios/usuario' ]);
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
