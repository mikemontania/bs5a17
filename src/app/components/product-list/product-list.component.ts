import { Component, EventEmitter, Input, OnInit, Output, ViewChild, computed, signal } from '@angular/core';
import { ProductoPage, ProductosItem } from '../../interfaces/productoItem.inteface';
import { ProductosService } from '../../services/productos.service';
import { CommonModule } from '@angular/common';
import { IncrementadorComponent } from '../incrementador/incrementador.component';
import { InputDebounceComponent } from '../inputDebounce/inputDebounce.component';
import { ProductCardComponent } from '../product-card/product-card.component';
import { PaginatorComponent } from '../paginator/paginator.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule,
    InputDebounceComponent,
    ProductCardComponent,
    IncrementadorComponent,
    PaginatorComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductsListComponent implements OnInit {
  @Input() sucursalId: number = 0;
  @Input() listaPrecioId: number = 0;
  @Input() cantidad: number = 1;
  @Output() productClicked = new EventEmitter<ProductosItem>();
  @Output() cantidadChange = new EventEmitter<number>();
  @ViewChild(InputDebounceComponent) inputDebounceComponent!: InputDebounceComponent;

  marcaId: number = 0;
  categoriaId: number = 0;
  subCategoriaId: number = 0;
  search: string = '';

  productosPage = signal<ProductoPage>({} as ProductoPage);
  page = signal<number>(1);
  totalPages = signal<number>(1);

  productos = computed(() => this.productosPage().productos ?? []);

  constructor(private _productosService: ProductosService) { }

  ngOnInit() {
    this.getProductosPage(1);
  }
  buscar(event: any) {
    this.search = event;
    this.getProductosPage(1); // Reset to first page on search
  }
  getProductosPage(page: number) {
    this._productosService
      .searchProductoPage(this.sucursalId, this.listaPrecioId, page, 14, this.marcaId, this.categoriaId, this.subCategoriaId, this.search)
      .subscribe(resp => {
        this.productosPage.set(resp);
        console.log(resp)
        this.page.set(resp.page);
        if (this.productos()?.length == 1) {
          //seleccionarlo
          this.limpiarCampo()
          this.buscar('')
          this.seleccionarProducto(this.productos()[0])
        }
        this.totalPages.set(resp.totalPages);
      }, err => {
        console.error(err);
      });
  }

  onPageChanged(newPage: number) {
    this.getProductosPage(newPage);
  }
  changeCantidad(event: number) {
    if (event > 1) {
      this.cantidad = +event;
      this.cantidadChange.emit(this.cantidad);
    }
  }
  limpiarCampo() {
    this.inputDebounceComponent.clearInput()
  }
  seleccionarProducto(event: ProductosItem) {
    this.productClicked.emit(event);
  }

}
