import { CommonModule } from "@angular/common";
import { Component, signal, computed, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { InputDebounceComponent } from "../../../components/inputDebounce/inputDebounce.component";
import { PaginatorComponent } from "../../../components/paginator/paginator.component";
import { ProductosService } from "../../../services/productos.service";
import { PageProductosSimple, SubCategoria } from '../../../interfaces/productos.interface';
import { EntidadesComponent } from "../../../components/entidad/entidades/entidades.component";
import Swal from "sweetalert2";
import { forkJoin } from "rxjs";

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule, FormsModule, InputDebounceComponent, PaginatorComponent, EntidadesComponent, ReactiveFormsModule],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent implements OnInit {
  searchTerm = signal<string>('');
  productosPage = signal<PageProductosSimple>({} as PageProductosSimple);
  page = signal<number>(1);
  totalPages = signal<number>(1);
  pageSize = signal<number>(10);
  categorias: any[] = [];
  marcas: any[] = [];
  subCategorias: any[] = [];
  productos = computed(() => this.productosPage().productos ?? []);
  productoForm: FormGroup;

  private fb = inject(FormBuilder)
  private _router = inject(Router)
  _productosService = inject(ProductosService);
  constructor() {
    this.productoForm = this.initForm()
    forkJoin([
      this._productosService.findAllMarcas(),
      this._productosService.findAllCategorias(),
      this._productosService.findAllSubCategorias(),
    ]).subscribe(([marcas, categorias, subCategorias]) => {
      this.marcas = marcas;
      this.categorias = categorias;
      this.subCategorias = subCategorias;
    });
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
    this.getPage(this.page());
  }


  initForm() {
    return this.fb.group({
      nombre: [null, Validators.required],
      descripcion: ['', Validators.required],
      subCategoriaId: [null, Validators.required],
      categoriaId: [null, Validators.required],
      marcaId: [null, Validators.required],
      activo: [true]
    });
  }



  actualizar(producto: any) {
    console.log(producto)
    this._productosService.update(producto).subscribe({
      next: async (resp) => {

        Swal.close();
        Swal.fire("Actualización exitosa!!!", "Se ha actualizado la producto", "success").then(() => {
          this.productoForm.reset();  // Restablecer el formulario

        });
      },
      error: (error) => {
        Swal.close();
        Swal.fire("Error", error, "error");
      },

    });
  }

  crear(e: Event) {
    e.preventDefault();

    const productoData = this.productoForm.value;
    this._productosService.create(productoData).subscribe({
      next: async (resp: any) => {

        this.getPage(this.page());
        Swal.close();
        Swal.fire("Creación exitosa!!!", "Se ha registrado la entidad", "success").then(() => {

          this.productoForm.reset();  // Restablecer el formulario

          this.initForm()
        });
      },
      error: (error) => {
        Swal.close();
        Swal.fire("Error", error, "error");
      },

    });
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

    this._productosService.searchSimple(this.page(), this.pageSize(), this.searchTerm())
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

  verVariantes(productoId: number) {
    this._router.navigate(['/productos', 'variantes', productoId]);

  }
  verProducto(productoId: number) {
    this._router.navigate(['/productos', 'producto', productoId]);

  }
  agregar() {
    this._router.navigate(['/productos/producto']);
  }
}
