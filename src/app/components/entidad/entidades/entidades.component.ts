
import { CommonModule } from '@angular/common';
import { Component, signal, inject, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginatorComponent } from '../../../components/paginator/paginator.component';
import Swal from 'sweetalert2';
import { EntidadesService } from '../../../services/entidades.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-entidades',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginatorComponent, ReactiveFormsModule],
  templateUrl: './entidades.component.html',
  styleUrl: './entidades.component.css'
})
export class EntidadesComponent {
  @Input() tipo: string = '';
  size = "medium";
  delay = 200;
  id = signal<number>(0)
  entidades: any[] = [];
  categorias: any[] = [];
  entidadForm: FormGroup;

  private fb = inject(FormBuilder)
  private _entidadService = inject(EntidadesService)
  private location = inject(Location)
  constructor() {
    // Initialize the property in the constructor
    this.entidadForm = this.initForm()


  }
  ngOnInit() {
    this.entidadForm = this.initForm()
    if (this.tipo == 'subcategorias') {
      this._entidadService.findAll('categorias').subscribe({
        next: (categorias) => {
          console.log(categorias)
          this.categorias = categorias;

        },
        error: message => {
          console.error(message);
          // Maneja el error de forma adecuada (por ejemplo, mostrando un mensaje al usuario)
        }
      });
    }
    this._entidadService.findAll(this.tipo).subscribe({
      next: (entidades) => {
        console.log(entidades)
        this.entidades = entidades;

      },
      error: message => {
        console.error(message);
        // Maneja el error de forma adecuada (por ejemplo, mostrando un mensaje al usuario)
      }
    });



  }
  initForm() {
    if (this.tipo == 'subcategorias') {
      return this.fb.group({
        descripcion: [null, Validators.required],
        categoriasId: [null, Validators.required],
        activo: [true]
      });
    } else if (this.tipo == 'presentaciones') {
      return this.fb.group({
        descripcion: [null, Validators.required],
        size: [null, Validators.required],
        activo: [true]
      });
    } else if (this.tipo == 'variedades') {
      return this.fb.group({
        descripcion: [null, Validators.required],
        color: [null, Validators.required],
        activo: [true]
      });
    } else if (this.tipo == 'unidades') {
      return this.fb.group({
        descripcion: [null, Validators.required],
        code: ['', Validators.required],
        activo: [true]
      });
    } else {
      return this.fb.group({
        descripcion: [null, Validators.required],
        activo: [true]
      });
    }





  }


  actualizar(entidad: any) {
    console.log(entidad)
    this._entidadService.update(this.tipo, entidad).subscribe({
      next: async (resp) => {

        Swal.close();
        Swal.fire("Actualización exitosa!!!", "Se ha actualizado la entidad", "success").then(() => {
          this.entidadForm.reset();  // Restablecer el formulario

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

    const entidadData = { ...this.entidadForm.value, productoId: this.id() };
    this._entidadService.create(this.tipo, entidadData).subscribe({
      next: async (resp: any) => {
        console.log(resp)
        this.entidades.push({ ...resp })
        Swal.close();
        Swal.fire("Creación exitosa!!!", "Se ha registrado la entidad", "success").then(() => {
          console.log(this.entidades)
          this.entidadForm.reset();  // Restablecer el formulario

          this.initForm()
        });
      },
      error: (error) => {
        Swal.close();
        Swal.fire("Error", error, "error");
      },

    });
  }


  atras() {
    this.location.back();
  }
}
