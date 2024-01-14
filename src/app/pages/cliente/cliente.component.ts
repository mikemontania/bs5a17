import { Component, OnInit, inject, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Cliente } from '../../interfaces/clientes.interface';
import { CommonModule } from '@angular/common';
import { ListaPrecioService } from '../../services/listaPrecio.service';
import { FormaVentaService } from '../../services/formaVenta.service';
import { ClientesService } from '../../services/clientes.service';
import { ListaPrecio } from '../../interfaces/listaPrecio.interface';
import { FormaVenta } from '../../interfaces/formaventa.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule , CommonModule],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css'
})
export class ClienteComponent  implements OnInit {

  listas = signal<ListaPrecio[]>([])
  formas = signal<FormaVenta[]>([])
  clienteForm: FormGroup;
  private fb = inject(FormBuilder)
  private _listaPrecioService = inject(ListaPrecioService)
  private _formaventaService = inject(FormaVentaService)
  private _clienteService = inject(ClientesService)
  constructor( ) {
    // Initialize the property in the constructor
    this.clienteForm = this.fb.group({});
  }
  ngOnInit() {
    this.clienteForm = this.fb.group({
      empresaId: [null, Validators.required],
      listaPrecioId: [null, Validators.required],
      formaVentaId: [null, Validators.required],
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

    this.getListas();
    this.getFormaVenta();
  }
getListas(){
  this._listaPrecioService.findAll().subscribe((resp:any)=> this.listas.set(resp));
}
getFormaVenta(){
  this._formaventaService.findAll().subscribe((resp:any)=> this.formas.set(resp));
}
  onSubmit() {

    const clienteData: Cliente = this.clienteForm.value;
    Swal.showLoading();
    console.log("login");
    this._clienteService.create(clienteData).subscribe({
      next: (resp) => {
        Swal.fire("Creacíon exitosa!!!", "Se ha registrado el cliente "+resp.razonSocial, "error");
      Swal.close();
      this.clienteForm = this.fb.group({});
    },
      error: message => {
        Swal.fire("Error", message, "error");
      }
    });
  }







}
