import { CommonModule } from "@angular/common";
import { Component,       EventEmitter, Input, OnInit, Output, ViewContainerRef, inject, signal } from "@angular/core";
import { debounceTime, distinctUntilChanged } from "rxjs";
import { InputDebounceComponent } from "../inputDebounce/inputDebounce.component";
import { Cliente } from '../../interfaces/clientes.interface';
import { ClientesService } from "../../services/clientes.service";
import Swal from "sweetalert2";
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from "@angular/forms";
import { FormaVenta } from "../../interfaces/formaventa.interface";
import { ListaPrecio } from "../../interfaces/listaPrecio.interface";
import { FormaVentaService } from "../../services/formaVenta.service";
import { ListaPrecioService } from "../../services/listaPrecio.service";

@Component({
  selector: "app-cliente-create",
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: "./ng-cliente-create.component.html",
  styleUrl: "./ng-cliente-create.component.css"
})
export class NgClienteCreateComponent implements OnInit {
  size = "large";
  delay=200;
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() cliente = new EventEmitter<Cliente>();

  listas = signal<ListaPrecio[]>([])
  formas = signal<FormaVenta[]>([])
  clienteForm: FormGroup;

  private fb = inject(FormBuilder)
  private _listaPrecioService = inject(ListaPrecioService)
  private _formaventaService = inject(FormaVentaService)
  private _clienteService = inject(ClientesService)
  constructor() {
    // Initialize the property in the constructor
    this.clienteForm = this.fb.group({});
  }
  ngOnInit() {
    this.clienteForm = this.fb.group({
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

    this.getListas();
    this.getFormaVenta();
  }
  getListas() {
    this._listaPrecioService.findAll().subscribe((resp: any) => this.listas.set(resp));
  }
  getFormaVenta() {
    this._formaventaService.findAll().subscribe((resp: any) => this.formas.set(resp));
  }
  onSubmit(e:Event) {
    e.preventDefault()
    const clienteData: Cliente = this.clienteForm.value;

    this._clienteService.create(clienteData).subscribe({
      next: (cliente) => {
        this.cliente.emit(cliente);
        this.isOpen = false;
      },
      error: (error) => {
   console.error(error)
        Swal.fire("Error", error, "error");
      },
      complete: () => {
        this.clienteForm = this.fb.group({});
      }// Use 'complete' instead of 'finally'
    });
  }

  close() {
    this.closeModal.emit();
  }
}
