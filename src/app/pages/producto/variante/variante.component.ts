import { Component, ElementRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { Presentacion, Producto, Unidad, Variante, Variedad } from '../../../interfaces/facturas.interface';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { ProductosService } from '../../../services/productos.service';
import { ImagenPipe } from '../../../pipes/imagen.pipe';
import { NgModalComponent } from '../../../components/ng-modal/ng-modal.component';
import { FileUploadService } from '../../../services/service.index';


@Component({
  selector: 'app-variante',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule,ImagenPipe,NgModalComponent],
  templateUrl: './variante.component.html',
  styleUrl: './variante.component.css'
})
export class VarianteComponent implements OnInit {
  public imagenSubir?: File;
  public imgTemp: any = null;

  sinImagen: string = './assets/images/sin-imagen.jpg';
  size = "medium";
  delay=200;
  isOpen = false;
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
  private _fileUploadService = inject(FileUploadService);

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
console.log(variante)
  this._productoService.updateVariante(variante).subscribe({
    next: (resp) => {
      if (this.imagenSubir) {
        this.subirImagen(variante.id);
       }
      Swal.close()
      Swal.fire("Actualización exitosa!!!", "Se ha actualizado la variante"  , "success");
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
open() {
  this.isOpen = true;
}
close() {
  this.isOpen = false;
}
  crear(varianteData:Variante){
    this._productoService.createVariante(varianteData).subscribe({
      next: (resp) => {
        this.subirImagen(resp.id)
        Swal.close()
        Swal.fire("Creación exitosa!!!", "Se ha registrado la variante "  , "success");

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

  actualizarImagen(event: any, id: number) {
    this.imagenSubir = event.target.files[0];

    if (!this.imagenSubir) {
      this.imgTemp = null;
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.imagenSubir);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
      this.subirImagen(id);
    };
  }

  cambiarImagen( event: any ) {
    this.imagenSubir = event.target.files[0] ;

    if ( !event.target.files[0]  ) {
      return this.imgTemp = null;
    }

    const reader = new FileReader();
    reader.readAsDataURL( event.target.files[0]  );

    reader.onloadend = () => {
      this.imgTemp = reader.result;

    }
return 'ok'
  }


  subirImagen(id:number ) {

    this._fileUploadService
      .actualizarFoto( this.imagenSubir!, 'productos', id ).subscribe(
        resp=>{resp
          console.log(resp)
        Swal.fire('Guardado', 'Imagen  actualizada', 'success');}
      )

  }

}
