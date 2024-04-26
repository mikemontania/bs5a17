import { Component, OnInit, inject, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Cliente } from '../../../interfaces/clientes.interface';
import { CommonModule } from '@angular/common';
import { ListaPrecioService } from '../../../services/listaPrecio.service';
import { FormaVentaService } from '../../../services/formaVenta.service';
import { ClientesService } from '../../../services/clientes.service';
import { ListaPrecio } from '../../../interfaces/listaPrecio.interface';
import { FormaVenta } from '../../../interfaces/formaventa.interface';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

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
  formas = signal<FormaVenta[]>([])
  clienteForm: FormGroup ;
  private fb = inject(FormBuilder)
  private _listaPrecioService = inject(ListaPrecioService)
  private _formaventaService = inject(FormaVentaService)
  private _clienteService = inject(ClientesService)
  private activatedRoute= inject(ActivatedRoute);
  private router= inject(Router);
  constructor() {
    // Initialize the property in the constructor
    this.clienteForm = this.initForm()

    forkJoin([
      this._listaPrecioService.findAll(),
      this._formaventaService.findAll(),

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
        this.id.set(+id ?? 0); // Maneja la posibilidad de valor nulo
        this._clienteService.getById( this.id()).subscribe({
          next: (clienteData) => {
            this.clienteForm.patchValue(clienteData);

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
    empresaId: [null, Validators.required],
    listaPrecioId: [null, Validators.required],
    formaVentaId: [1, Validators.required],
    razonSocial: [null, Validators.required],
    nroDocumento: [null, Validators.required],
    direccion: [null, Validators.required],
    telefono: [null, Validators.required],
    cel: [null, Validators.nullValidator], // Optional field
    email: [null, [Validators.required, Validators.email]],
    excentoIva: [false],
    latitud: [null],
    longitud: [null],
    predeterminado: [false],
    empleado: [0],
    propietario: [false],
    activo: [true]
  });
}
  onSubmit(e:Event) {
    e.preventDefault()
    const clienteData: Cliente = this.clienteForm.value;
    Swal.showLoading();




    if (this.id()) {
      const cliente = {
        ...clienteData,
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



}
