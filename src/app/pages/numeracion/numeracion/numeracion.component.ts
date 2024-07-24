import { Component, OnInit, inject, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ListaPrecio } from '../../../interfaces/listaPrecio.interface';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { NumeracionService, SucursalService } from '../../../services/service.index';
import { Numeracion } from '../../../interfaces/numeracion.interface';

@Component({
  selector: 'app-numeracion',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './numeracion.component.html',
  styleUrl: './numeracion.component.css'
})
export class NumeracionComponent implements OnInit {
  id = signal<number>(0)
  sucursales = signal<ListaPrecio[]>([])
  numeracionForm: FormGroup ;
  private fb = inject(FormBuilder)
  private _sucursalService = inject(SucursalService)
  private _numeracionService = inject(NumeracionService)
  private activatedRoute= inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {
    // Initialize the property in the constructor
    this.numeracionForm = this.initForm()

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
        this._numeracionService.getById( this.id()).subscribe({
          next: (numeracionData) => {
            this.numeracionForm.patchValue(numeracionData);
          },
          error: message => {
            console.error(message);
            // Maneja el error de forma adecuada (por ejemplo, mostrando un mensaje al usuario)
          }
        });
      }
    });

  }
  private initForm(){
    return this.fb.group({
      empresaId: [1, Validators.required],
      inicioTimbrado: [null, Validators.required],
      finTimbrado: [null, Validators.required],
      sucursalId: [null, Validators.required],
      numeroInicio: [null, [Validators.required, Validators.min(1), Validators.max(999999999)]],
      numeroFin: [null, [Validators.required, Validators.min(1), Validators.max(999999999)]],
      serie: ['', [Validators.required, Validators.pattern(/^\d{3}-\d{3}$/)]],
      timbrado: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      tipoComprobante: ['FACTURA', Validators.required],
      ultimoNumero: [null, [Validators.required, Validators.min(0)]],
      tipoImpresion: ['FACTURA', Validators.required],
      activo: [false]  // Puedes ajustar el valor predeterminado según tus necesidades
    });
  }
  onSubmit(e:Event) {
    e.preventDefault()
    if (this.numeracionForm.invalid) {
      this.numeracionForm.markAllAsTouched();

      // Log the errors to the console
      console.log(this.getFormErrors());

      return;
    }
    const numeracionData: Numeracion = this.numeracionForm.value;
    Swal.showLoading();
    if (this.id()) {
      const numeracion = {
        ...numeracionData,
        id:this.id()
       }
      this._numeracionService.update(numeracion).subscribe({
        next: (resp) => {
          Swal.close()
          Swal.fire("Actualización exitosa!!!", "Se ha actualizado al numeracion: " + resp.serie, "success");
          this.router.navigateByUrl('/numeraciones');
        },
        error: (error) => {
          Swal.close()
          Swal.fire("Error", error, "error");
        },
        complete: () => {
          this.numeracionForm = this.fb.group({});
        }// Use 'complete' instead of 'finally'
      });
    } else {

      this._numeracionService.create(numeracionData).subscribe({
        next: (resp) => {

          this.numeracionForm = this.initForm()
          Swal.close()
          Swal.fire("Creación exitosa!!!", "Se ha registrado el numeracion " + resp.serie, "success");
          this.router.navigateByUrl('/numeraciones');
        },
        error: (error) => {
          Swal.close()
          Swal.fire("Error", error, "error");
        },
        complete: () => {
          this.numeracionForm = this.fb.group({});
        }// Use 'complete' instead of 'finally'
      });
    }

  }
  getFormErrors() {
    const errors: { field: string; errors: any }[] = [];

    Object.keys(this.numeracionForm.controls).forEach(key => {
      const control = this.numeracionForm.get(key);
      if (control && control.invalid && (control.touched || control.dirty)) {
        errors.push({ field: key, errors: control.errors });
      }
    });

    return errors;
  }


}
