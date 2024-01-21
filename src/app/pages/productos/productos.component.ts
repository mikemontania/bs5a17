import { CommonModule } from "@angular/common";
import { Component, signal, computed, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { InputDebounceComponent } from "../../components/inputDebounce/inputDebounce.component";
import { PaginatorComponent } from "../../components/paginator/paginator.component";
import { TooltipDirective } from "../../directivas/tooltip.directive";
import { ProductosService } from "../../services/productos.service";
import { PageProductosSimple } from "../../interfaces/productos.interface";


@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, InputDebounceComponent, PaginatorComponent, TooltipDirective,],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent {
  searchTerm = signal<string>('');
  productosPage = signal<PageProductosSimple>({} as PageProductosSimple);
  page = signal<number>(1);
  totalPages = signal<number>(1);
  pageSize = signal<number>(10);

  productos = computed(() => this.productosPage().productos ?? []);

  private _router = inject(Router)
  _productosService = inject(ProductosService);
  constructor() {
    const storedSearchData = localStorage.getItem('searchProductoData');

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

    localStorage.setItem('searchProductoData', JSON.stringify({
      searchTerm: this.searchTerm(),
      page: this.page(),
      pageSize: this.pageSize(),
    }));

    this._productosService.searchSimple(this.page(),  this.pageSize(), this.searchTerm())
      .subscribe({
        next: (resp) => {
          this.productosPage.set(resp);
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


  verProducto(productoId: number) {
    this._router.navigate(['/productos', 'producto', productoId]);

  }
  agregar() {
    this._router.navigate(['/productos/producto' ]);
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
