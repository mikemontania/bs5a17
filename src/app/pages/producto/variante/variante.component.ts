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
import { Location } from '@angular/common';

@Component({
  selector: 'app-variante',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, ImagenPipe, NgModalComponent],
  templateUrl: './variante.component.html',
  styleUrl: './variante.component.css'
})
export class VarianteComponent implements OnInit {
  public imagenesSubir: (File | null)[] = [];
  public imgTemps: any[] = [];

  sinImagen: string = '../../../../assets/no-img.jpg';
  size = "medium";
  delay = 200;
  id = signal<number>(0)
  variantes  :Variante[] =[];
  variedades = signal<Variedad[]>([])
  presentaciones = signal<Presentacion[]>([])
  unidades = signal<Unidad[]>([])
  productos = signal<Producto[]>([])
  varianteForm: FormGroup;

  private fb = inject(FormBuilder)
  private _productoService = inject(ProductosService)
  private activatedRoute = inject(ActivatedRoute);
  private _fileUploadService = inject(FileUploadService);
  private location= inject(Location)
  constructor() {
    // Initialize the property in the constructor
    this.varianteForm = this.initForm()

    forkJoin([
      this._productoService.findAllVariedades(),
      this._productoService.findAllPresentaciones(),
      this._productoService.findAllUnidades(),
      this._productoService.findAll(),
    ]).subscribe(([variedades, presentaciones, unidades, productos]) => {
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
      if (id) {
        this.id.set(+id ?? 0); // Maneja la posibilidad de valor nulo
        this._productoService.findVariantesByProductoId(this.id()).subscribe({
          next: (variantes) => {
            this.variantes = variantes;
          },
          error: message => {
            console.error(message);
            // Maneja el error de forma adecuada (por ejemplo, mostrando un mensaje al usuario)
          }
        });
      }
    });

  }
  initForm() {
    return this.fb.group({
      codBarra: [null, Validators.required],
      codErp: [null, Validators.required],
      porcIva: [10, Validators.required],
      productoId: [null, Validators.required],
      unidadId: [null, Validators.required],
      presentacionId: [null, Validators.required],
      variedadId: [null, Validators.required],
      activo: [true]
    });
  }


  actualizar(variante: Variante, index: number) {
    console.log(variante)
    this._productoService.updateVariante(variante).subscribe({
      next: async (resp) => {
        const img = await this.subirImagen(variante.id, index);
        //this.variantes[index].set({...resp,img})
        this.variantes[index] = { ...resp, img };

        Swal.close();
        Swal.fire("Actualización exitosa!!!", "Se ha actualizado la variante", "success").then(() => {
          this.varianteForm.reset();  // Restablecer el formulario
          this.imgTemps[index] = null;  // Limpiar la imagen temporal
          this.imagenesSubir[index] = null;  // Limpiar la imagen para subir
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

    const varianteData = { ...this.varianteForm.value, productoId: this.id() };
    this._productoService.createVariante(varianteData).subscribe({
      next: async (resp: any) => {
        const img = await this.subirImagen(resp.id, 99999)
        console.log(img)
        this.variantes.push({ ...resp, img })
        Swal.close();
        Swal.fire("Creación exitosa!!!", "Se ha registrado la variante", "success").then(() => {
          console.log(img)
          console.log(this.variantes)
          this.varianteForm.reset();  // Restablecer el formulario
          this.imgTemps[99999] = null;  // Limpiar la imagen temporal
          this.imagenesSubir[99999] = null;  // Limpiar la imagen para subir
          this.initForm()
        });
      },
      error: (error) => {
        Swal.close();
        Swal.fire("Error", error, "error");
      },

    });
  }


  actualizarImagen(event: any, id: number, index: number) {

    this.imagenesSubir[index] = event.target.files[0];

    if (!this.imagenesSubir[index]) {
      this.imgTemps[index] = null;
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.imagenesSubir[index]!);

    reader.onloadend = () => {
      this.imgTemps[index] = reader.result;
    };
  }





  cambiarImagen(event: any, index: number) {
    this.imagenesSubir[index] = event.target.files[0];

    if (!this.imagenesSubir[index]) {
      this.imgTemps[index] = null;
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.imagenesSubir[index]!);

    reader.onloadend = () => {
      this.imgTemps[index] = reader.result;
    }

    return 'ok';
  }


  subirImagen(id: number, index: number): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.imagenesSubir[index]) {
        this._fileUploadService.actualizarFoto(this.imagenesSubir[index]!, 'productos', id).subscribe(
          img => {
            const fileInput = document.getElementById('fileInput_' + index) as HTMLInputElement;
            if (fileInput) {
              fileInput.value = ''; // Limpiar el campo de entrada de archivos
            }
            console.log(img);
            // Swal.fire('Guardado', 'Imagen actualizada', 'success');
            resolve(img);
          },
          error => reject(error)
        );
      } else {
        resolve('No hay imagen para subir');
      }
    });
  }
atras(){
  this.location.back();
}
}
