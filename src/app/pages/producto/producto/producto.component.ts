import { Component, OnInit, inject, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Categoria, Marca, Producto, SubCategoria } from '../../../interfaces/productos.interface';
import { CommonModule } from '@angular/common';
import { ListaPrecioService } from '../../../services/listaPrecio.service';
import { FormaVentaService } from '../../../services/formaVenta.service';
import { ProductosService } from '../../../services/productos.service';
import { ListaPrecio } from '../../../interfaces/listaPrecio.interface';
import { FormaVenta } from '../../../interfaces/formaventa.interface';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent implements OnInit {
  id = signal<number>(0)
  marcas = signal<Marca[]>([])
  categorias = signal<Categoria[]>([])
  subCategorias = signal<SubCategoria[]>([])
  productoForm: FormGroup ;
  private fb = inject(FormBuilder)
  private _productoService = inject(ProductosService)
  private activatedRoute= inject(ActivatedRoute);
  constructor() {
    // Initialize the property in the constructor
    this.productoForm = this.initForm()

    forkJoin([
      this._productoService.findAllMarcas(),
      this._productoService.findAllCategorias(),
      this._productoService.findAllSubCategorias(),
    ]).subscribe(([marcas, categorias,subCategorias]) => {
      this.marcas.set(marcas);
      this.categorias.set(categorias);
      this.subCategorias.set(subCategorias);
    });

  }
  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id')
      console.log(id)
      if ( id) {
        this.id.set(+id ?? 0); // Maneja la posibilidad de valor nulo
        this._productoService.getById( this.id()).subscribe({
          next: (productoData) => {
            this.productoForm.patchValue(productoData);

          },
          error: message => {
            console.error(message);
            // Maneja el error de forma adecuada (por ejemplo, mostrando un mensaje al usuario)
          }
        });
      }
    });

  }
initForm(){
  return this.fb.group({
    nombre: [null, Validators.required],
    descripcion: [null, Validators.required],
    subCategoriaId: [null, Validators.required],
    categoriaId: [null, Validators.required],
    marcaId: [null, Validators.required],
    activo: [true]
  });
}
  onSubmit(e:Event) {
    e.preventDefault()
    const productoData: Producto = this.productoForm.value;
    Swal.showLoading();

    if (this.id()) {
      const producto = {
        ...productoData,
        id:this.id()
       }
      this._productoService.update(producto).subscribe({
        next: (resp) => {
          Swal.close()
          Swal.fire("Actualización exitosa!!!", "Se ha actualizado al producto: " + resp.nombre, "success");

        },
        error: (error) => {
          Swal.close()
          Swal.fire("Error", error.message, "error");
        },
        complete: () => {
          this.productoForm = this.fb.group({});
        }// Use 'complete' instead of 'finally'
      });
    } else {

      this._productoService.create(productoData).subscribe({
        next: (resp) => {
          Swal.close()
          Swal.fire("Creación exitosa!!!", "Se ha registrado el producto " + resp.nombre, "success");

        },
        error: (error) => {
          Swal.close()
          Swal.fire("Error", error.message, "error");
        },
        complete: () => {
          this.productoForm = this.fb.group({});
        }// Use 'complete' instead of 'finally'
      });
    }

  }



}
