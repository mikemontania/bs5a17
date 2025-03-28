import { Component, OnInit, inject, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Cliente } from '../../../interfaces/clientes.interface';
import { CommonModule } from '@angular/common';
import { ListaPrecioService } from '../../../services/listaPrecio.service';
import { CondicionPagoService } from '../../../services/condicionPago.service';
import { ClientesService } from '../../../services/clientes.service';
import { ListaPrecio } from '../../../interfaces/listaPrecio.interface';
import { CondicionPago } from '../../../interfaces/condicionPago.interface';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { paises_codigos } from '../../../interfaces/codigoPaises';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css'
})
export class ClienteComponent implements OnInit {
  id = signal<number>(0)
  listas = signal<ListaPrecio[]>([])
  formas = signal<CondicionPago[]>([])
  clienteForm: FormGroup ;
  paises :any[]=[...paises_codigos]
   private fb = inject(FormBuilder)
  private _listaPrecioService = inject(ListaPrecioService)
  private _formadocumentoService = inject(CondicionPagoService)
  private _clienteService = inject(ClientesService)
  private activatedRoute= inject(ActivatedRoute);
  private router= inject(Router);
  constructor() {
    // Initialize the property in the constructor
    this.clienteForm = this.initForm()

    forkJoin([
      this._listaPrecioService.findAll(),
      this._formadocumentoService.findAll(),

    ]).subscribe(([listas, formas]) => {
      this.listas.set(listas);
      this.formas.set(formas);
    });

  }
  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id')
      console.log(id)
      if ( id) {
        this.id.set(+id || 0); // Maneja la posibilidad de valor nulo
        this._clienteService.getById( this.id()).subscribe({
          next: (clienteData) => {
            this.clienteForm?.patchValue(clienteData);  // Use optional chaining to prevent null errors
          },
          error: message => {
            console.error(message);
            // Maneja el error de forma adecuada (por ejemplo, mostrando un mensaje al usuario)
          }
        });
      }
    });

    this.clienteForm.get('naturalezaReceptor')?.valueChanges.subscribe(value => {
      const tipoDocIdentidadControl = this.clienteForm.get('tipoDocIdentidad');

      if (value == 2) {
        // Si es Persona Física, hacer obligatorio
        tipoDocIdentidadControl?.setValidators([Validators.required]);
      } else {
        // Si es otro tipo, quitar la validación y resetear el campo
        tipoDocIdentidadControl?.clearValidators();
        tipoDocIdentidadControl?.setValue(null);
      }
      tipoDocIdentidadControl?.updateValueAndValidity();
    });

  }
initForm(){
  return this.fb.group({
    empresaId: [1, Validators.required],
    listaPrecioId: [1, Validators.required],
    condicionPagoId: [1, Validators.required],
    razonSocial: [null, [Validators.required, Validators.minLength(7)]],
    nombreFantasia: [null ],
    nroDocumento: [null, [Validators.required, Validators.minLength(5), Validators.pattern(/^[a-zA-Z0-9-]+$/)]],
    direccion: [null ],
    telefono: [null ],
    cel: [null ],
    email: [null, [Validators.required, Validators.email]],
    excentoIva: [false],
    latitud: [null],
    longitud: [null],
    predeterminado: [false],
    empleado: [0],
    propietario: [false],
    activo: [true],
    tipoOperacionId: [null, [Validators.required, Validators.pattern(/^[1-4]$/)]],
    naturalezaReceptor: [null, [Validators.required, Validators.pattern(/^[1-2]$/)]],//1= contribuyente    2= no contribuyente
    codigoPais: ['PRY', [Validators.required, Validators.maxLength(3)]],
    tipoContribuyente: [null, [Validators.required, Validators.pattern(/^[1-2]$/)]], //1Persona Física 2Persona Jurídica
    tipoDocIdentidad: [null]
  });
}
  onSubmit(e:Event) {
    e.preventDefault()
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();

      // Log the errors to the console
      console.log(this.getFormErrors());

      return;
    }
    const clienteData: Cliente = this.clienteForm.value;
    Swal.showLoading();




    if (this.id()) {
      const cliente = {
        ...clienteData,
        razonSocial: clienteData.razonSocial.toUpperCase(),
        direccion: clienteData?.direccion?.toUpperCase() || null,
        id:this.id()
       }
      this._clienteService.update(cliente).subscribe({
        next: (resp) => {
          Swal.close()
          Swal.fire("Actualización exitosa!!!", "Se ha actualizado al cliente: " + resp.razonSocial, "success");
          this.router.navigateByUrl('/clientes');

        },
        error: (error) => {
          Swal.close()
          Swal.fire("Error", error, "error");
        },
        complete: () => {
          this.clienteForm = this.fb.group({});
        }// Use 'complete' instead of 'finally'
      });
    } else {

      this._clienteService.create(clienteData).subscribe({
        next: (resp) => {
          Swal.close()
          Swal.fire("Creación exitosa!!!", "Se ha registrado el cliente " + resp.razonSocial, "success");
          this.router.navigateByUrl('/clientes');

        },
        error: (error) => {
          Swal.close()
          Swal.fire("Error", error, "error");
        },
        complete: () => {
          this.clienteForm = this.fb.group({});
        }// Use 'complete' instead of 'finally'
      });
    }

  }
  getFormErrors() {
    const errors: { field: string; errors: any }[] = [];

    Object.keys(this.clienteForm.controls).forEach(key => {
      const control = this.clienteForm.get(key);
      if (control && control.invalid && (control.touched || control.dirty)) {
        errors.push({ field: key, errors: control.errors });
      }
    });

    return errors;
  }
  toUpeCaseEvent(evento: string) {
    return evento.toLocaleUpperCase();
  }




}

