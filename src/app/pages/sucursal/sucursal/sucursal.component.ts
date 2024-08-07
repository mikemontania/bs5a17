import { Component, OnInit, inject, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ListaPrecio } from '../../../interfaces/listaPrecio.interface';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { SucursalService } from '../../../services/service.index';
import { Sucursal } from '../../../interfaces/sucursal.interface';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-sucursal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule,NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './sucursal.component.html',
  styleUrl: './sucursal.component.css'
})
export class SucursalComponent implements OnInit {
  id = signal<number>(0)
  sucursales = signal<ListaPrecio[]>([])
  sucursalForm: FormGroup ;
  private fb = inject(FormBuilder)
  private _sucursalService = inject(SucursalService)
  private activatedRoute= inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {
    // Initialize the property in the constructor
    this.sucursalForm = this.initForm()

    forkJoin([
      this._sucursalService.findAll(),


    ]).subscribe(([sucursales ]) => {
      this.sucursales.set(sucursales);

    });

  }
  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id')
      console.log(id)
      if ( id) {
        this.id.set(+id ?? 0); // Maneja la posibilidad de valor nulo
        this._sucursalService.getById( this.id()).subscribe({
          next: (sucursalData) => {
            this.sucursalForm.patchValue(sucursalData);
          },
          error: message => {
            console.error(message);
            // Maneja el error de forma adecuada (por ejemplo, mostrando un mensaje al usuario)
          }
        });
      }
    });

  }
  private initForm() {
    return this.fb.group({
      empresasId: [1, Validators.required],
      descripcion:[null, [Validators.required, Validators.minLength(5)]],
      direccion: [null, [Validators.required, Validators.minLength(5)]],
      cel: [null, [Validators.required, Validators.minLength(10)]],
      telefono: [null, [Validators.required, Validators.minLength(9)]],
      email: [null, [Validators.required, Validators.email]],
      activo: [true]
    });
  }
  getFormErrors() {
    const errors: { field: string; errors: any }[] = [];

    Object.keys(this.sucursalForm.controls).forEach(key => {
      const control = this.sucursalForm.get(key);
      if (control && control.invalid && (control.touched || control.dirty)) {
        errors.push({ field: key, errors: control.errors });
      }
    });

    return errors;
  }
  onSubmit(e:Event) {
    e.preventDefault();

    if (this.sucursalForm.invalid) {
      this.sucursalForm.markAllAsTouched();

      // Log the errors to the console
      console.log(this.getFormErrors());

      return;
    }
    const sucursalData: Sucursal = this.sucursalForm.value;
    Swal.showLoading();
    if (this.id()) {
      const sucursal = {
        ...sucursalData,
        id:this.id()
       }
      this._sucursalService.update(sucursal).subscribe({
        next: (resp) => {
          Swal.close()
          Swal.fire("Actualización exitosa!!!", "Se ha actualizado al sucursal: " + resp.descripcion, "success");
          this.router.navigateByUrl('/sucursales');
        },
        error: (error) => {
          Swal.close()
          Swal.fire("Error", error, "error");
        },
        complete: () => {
          this.sucursalForm = this.fb.group({});
        }// Use 'complete' instead of 'finally'
      });
    } else {

      this._sucursalService.create(sucursalData).subscribe({
        next: (resp) => {

          this.sucursalForm = this.initForm()
          Swal.close()
          Swal.fire("Creación exitosa!!!", "Se ha registrado el sucursal " + resp.serie, "success");
          this.router.navigateByUrl('/sucursales');
        },
        error: (error) => {
          Swal.close()
          Swal.fire("Error", error, "error");
        },
        complete: () => {
          this.sucursalForm = this.fb.group({});
        }// Use 'complete' instead of 'finally'
      });
    }

  }



}
