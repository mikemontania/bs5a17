

  import { CommonModule } from '@angular/common';
  import { Component, signal, inject, Input, EventEmitter, Output } from '@angular/core';
  import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

  import Swal from 'sweetalert2';
  import { Location } from '@angular/common';

import { PaginatorComponent } from '../paginator/paginator.component';
import { EmpresaService } from '../../services/empresas.service';

  @Component({
    selector: 'app-activiadad',
    standalone: true,
    imports: [CommonModule, FormsModule, PaginatorComponent, ReactiveFormsModule],
  templateUrl: "./actividad.component.html",
  styleUrl: "./actividad.component.css"
  })
  export class ActividadComponent {

    actividades: any[] = [];
    actividadForm: FormGroup;
    private fb = inject(FormBuilder)
    private _actividadService = inject(EmpresaService)
    private location = inject(Location)
    constructor() {
      // Initialize the property in the constructor
      this.actividadForm = this.initForm()
    }
    ngOnInit() {
      this.actividadForm = this.initForm()

        this._actividadService.getActividades().subscribe({
          next: (actividades) => {
            console.log(actividades)
            this.actividades = actividades;

          },
          error: message => {
            console.error(message);
            // Maneja el error de forma adecuada (por ejemplo, mostrando un mensaje al usuario)
          }
        });


    }
    initForm() {
        return this.fb.group({
          codigo: [null, Validators.required],
          descripcion: [null, Validators.required],

        });

    }


    eliminarActiviadad(actividad:any ){
      this._actividadService.quitarActividad(  actividad.id).subscribe({
        next: async (resp: any) => {
          this.actividades = this.actividades.filter(item => item.id !== actividad.id);

          Swal.close();
          Swal.fire("Eliminación Exitosa!!!", "Operación exitosa", "success").then(() => {
            console.log(this.actividades)
            this.actividadForm.reset();  // Restablecer el formulario
            this.initForm()
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

      const actividadData = { ...this.actividadForm.value };
      console.log(actividadData)
      this._actividadService.addActividad(  actividadData).subscribe({
        next: async (resp: any) => {
          const actividad =resp.actividad;
          console.log(actividad)
          this.actividades.push({ ...actividad})
          Swal.close();
          Swal.fire("Creación exitosa!!!", "Se ha registrado la actividad", "success").then(() => {
            console.log(this.actividades)
            this.actividadForm.reset();  // Restablecer el formulario

            this.initForm()
          });
        },
        error: (error) => {
          Swal.close();
          Swal.fire("Error", "Los datos no son validos", "error");
        },

      });
    }


    atras() {
      this.location.back();
    }
  }
