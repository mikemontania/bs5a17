import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef, inject, signal } from "@angular/core";
import { InputDebounceComponent } from "../inputDebounce/inputDebounce.component";
import { Banco, Cobranza, MedioPago } from '../../interfaces/facturas.interface';
import { CobranzaService } from "../../services/cobranza.service";
import { BancoService } from '../../services/banco.service';
import { MedioPagoService } from "../../services/medioPago.service";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Observable, of } from "rxjs";

@Component({
  selector: "app-cobranza-create",
  standalone: true,
  imports: [CommonModule,FormsModule      , ReactiveFormsModule, InputDebounceComponent],
  templateUrl: "./ng-cobranza-create.component.html",
  styleUrl: "./ng-cobranza-create.component.css"
})
export class NgCobranzaCreateComponent implements OnInit {
  size = "large";
  delay = 200;
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() cobranza = new EventEmitter<Cobranza>();
  // Observables

  medioPago = signal<MedioPago>({} as MedioPago);

  bancos = signal<Banco[]>([]);
  medios = signal<MedioPago[]>([]);

  cobranzaForm: FormGroup;

  private fb = inject(FormBuilder)
  private _cobranzaService = inject(CobranzaService);
  private _bancoService = inject(BancoService);
  private _medioPagoService = inject(MedioPagoService);

  constructor() {
    // Initialize the property in the constructor

    this.cobranzaForm =  this.initForm();



  }



initForm(){
  return this.fb.group({
    fechaEmision: [null],
    fechaVencimiento: [null],
    importeAbonado: [null, Validators.required],
    importeCobrado: [0, Validators.required],
    nroCuenta: [null],
    nroRef: [null],
    saldo: [0, Validators.required],
    bancoId: [null],
    medioPagoId: [null, Validators.required],
    montoAbonado: [0] // Valor por defecto de montoAbonado
  });
}

  ngOnInit(): void {
    this.getBancos();
    this.getMediosPago();


  }
  private clearValidators() {
    ['bancoId', 'fechaEmision', 'fechaVencimiento', 'nroRef', 'nroCuenta'].forEach(controlName => {
      const control = this.cobranzaForm?.get(controlName); // Añade '?' para manejar posibles valores nulos
      if (control) {
        control.clearValidators();
        control.updateValueAndValidity();
      }
    });
  }
  private applyValidators() {
    const medioPago = this.medioPago();

    if (medioPago.tieneBanco) {
      this.cobranzaForm.get('bancoId')?.setValidators(Validators.required);
    }

    if (medioPago.esCheque) {
      this.cobranzaForm.get('fechaEmision')?.setValidators(Validators.required);
      this.cobranzaForm.get('fechaVencimiento')?.setValidators(Validators.required);
    }

    if (medioPago.esCheque || medioPago.tieneRef) {
      this.cobranzaForm.get('nroRef')?.setValidators([Validators.required, Validators.minLength(4)]);
    }

    if (medioPago.esCheque) {
      this.cobranzaForm.get('nroCuenta')?.setValidators([Validators.required, Validators.minLength(12)]);
    }

    ['bancoId', 'fechaEmision', 'fechaVencimiento', 'nroRef', 'nroCuenta'].forEach(controlName => {
      this.cobranzaForm.get(controlName)?.updateValueAndValidity();
    });
  }


  onSubmit(e: Event) {
    e.preventDefault();

    const data = this.cobranzaForm.value;
    console.log(data);

    // Procesar los datos del formulario (enviar a servidor, guardar, etc.)

    // Si deseas limpiar el formulario después del envío:
    this.cobranzaForm =  this.initForm();
    this.medioPago.set({} as MedioPago)
  }
  selectCobranza(cobranza: Cobranza) {
    this.cobranza.emit(cobranza);
  }

  onMedioPagoChange(id: number) {
    // Actualiza las validaciones de acuerdo al tipo de medio de pago seleccionado
    // ...

    // Limpia las validaciones existentes antes de aplicar las nuevas
    this.clearValidators();
    const medioPagoEncontrado = this.medios().find(m => m.id === id);
    if (medioPagoEncontrado) {
      this.medioPago.set(medioPagoEncontrado);

      // Aplica las nuevas validaciones
      this.applyValidators();
    }
  }

  close() {
    this.closeModal.emit();
  }
  getBancos() {
    this._bancoService.findAll().subscribe((resp: any) => this.bancos.set(resp));
  }
  getMediosPago() {
    this._medioPagoService.findAll().subscribe((resp: any) => this.medios.set(resp));
  }
}
