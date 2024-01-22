import { Component, OnInit, inject, signal } from '@angular/core';
import { Presentacion, Producto, Unidad, Variante, Variedad } from '../../../interfaces/facturas.interface';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { ProductosService } from '../../../services/productos.service';
import { ImagenPipe } from '../../../pipes/imagen.pipe';


@Component({
  selector: 'app-variante',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule,ImagenPipe],
  templateUrl: './variante.component.html',
  styleUrl: './variante.component.css'
})
export class VarianteComponent implements OnInit {
  /* imagenSubir: File ; */
  imagenTemp: any;
  id = signal<number>(0)
  variantes = signal<Variante[]>([])
  variedades = signal<Variedad[]>([])
  presentaciones = signal<Presentacion[]>([])
  unidades = signal<Unidad[]>([])
  productos = signal<Producto[]>([])
  varianteForm: FormGroup ;
  private fb = inject(FormBuilder)
  private _productoService = inject(ProductosService)
  private activatedRoute= inject(ActivatedRoute);
  constructor() {
    // Initialize the property in the constructor
    this.varianteForm = this.initForm()

    forkJoin([
      this._productoService.findAllVariedades(),
      this._productoService.findAllPresentaciones(),
      this._productoService.findAllUnidades(),
      this._productoService.findAll(),
    ]).subscribe(([variedades, presentaciones,unidades, productos]) => {
      this.variedades.set(variedades);
      this.presentaciones.set(presentaciones);
      this.unidades.set(unidades);
      this.productos.set(productos);
    });

  }
  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id')
      console.log(id)
      if ( id) {
        this.id.set(+id ?? 0); // Maneja la posibilidad de valor nulo
        this._productoService.findVariantesByProductoId( this.id()).subscribe({
          next: (variantes) => {
            this.variantes.set(variantes)
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
    codBarra: [null, Validators.required],
    codErp: [null, Validators.required],
    porcIva: [null, Validators.required],
    productoId: [null, Validators.required],
    unidadId: [null, Validators.required],
    presentacionId: [null, Validators.required],
    variedadId: [null, Validators.required],
    activo: [true]
  });
}


onSubmit(e: Event) {
  e.preventDefault(); // Prevenir el comportamiento de submit por defecto

  const varianteData = this.varianteForm.value;
  this.crear(varianteData);
}
actualizar(variante:Variante){

  this._productoService.updateVariante(variante).subscribe({
    next: (resp) => {
      Swal.close()
      Swal.fire("Actualización exitosa!!!", "Se ha actualizado al variante: " + resp.nombre, "success");
     /*  if (this.imagenSubir) {
       this.cambiarImagen(this.variante.id);
      } */
    },
    error: (error) => {
      Swal.close()
      Swal.fire("Error", error.message, "error");
    },
    complete: () => {
      this.varianteForm = this.fb.group({});
    }// Use 'complete' instead of 'finally'
  });
}

  crear(varianteData:Variante){
    this._productoService.createVariante(varianteData).subscribe({
      next: (resp) => {
        Swal.close()
        Swal.fire("Creación exitosa!!!", "Se ha registrado el variante " + resp.nombre, "success");
        /* this._productoService.uploadImage(this.imagenSubir, producto.codProducto).subscribe((pro: Producto) => {
           this.producto = pro;
          this.imagenTemp = null;
           $('#uploadedfile').val(null);
        }); */
      },
      error: (error) => {
        Swal.close()
        Swal.fire("Error", error.message, "error");
      },
      complete: () => {
        this.varianteForm = this.fb.group({});
      }// Use 'complete' instead of 'finally'
    });
  }

  cambiarImagen(cod:number) {
  /*   this._productoService.uploadImage(this.imagenSubir, cod).subscribe((producto: Producto) => {
    this.producto = producto;
      this.imagenTemp = null;
      $('#uploadedfile').val(null);
    }); */
  }

  seleccionImage(archivo: File) {
    // si  no existe no hacer nada
    if (!archivo) {
    /*   this.imagenSubir = null; */
      return;
    }
    if (archivo.type.indexOf('image') < 0) {
   /*    swal.fire('Sólo imágenes', 'El archivo seleccionado no es una imagen', 'error');
      this.imagenSubir = null; */
      return;
    }
    //this.imagenSubir = archivo;
    let reader = new FileReader();
    let urlImagenTemp = reader.readAsDataURL(archivo);
    reader.onloadend = () => {
      console.log(reader.result);
      this.imagenTemp = reader.result;
    };
  }

}
