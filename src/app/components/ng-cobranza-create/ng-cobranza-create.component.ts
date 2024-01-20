import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef, computed, inject, signal } from "@angular/core";
import { InputDebounceComponent } from "../inputDebounce/inputDebounce.component";
import { Banco, Cobranza, MedioPago, CobranzaDetalle } from '../../interfaces/facturas.interface';
import { CobranzaService } from "../../services/cobranza.service";
import { BancoService } from '../../services/banco.service';
import { MedioPagoService } from "../../services/medioPago.service";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Observable, forkJoin, of } from "rxjs";
import moment from "moment";

@Component({
  selector: "app-cobranza-create",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputDebounceComponent],
  templateUrl: "./ng-cobranza-create.component.html",
  styleUrl: "./ng-cobranza-create.component.css"
})
export class NgCobranzaCreateComponent implements OnInit {
  size = "large";
  delay = 200;
  @Input() importeTotal = 0;
  @Input() userId = 0;
  @Input() sucursalId = 0;
  @Input() tipo = '';
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() cobranza = new EventEmitter<Cobranza>();
  // Observables
  detalles = signal<CobranzaDetalle[]>([])
  medioPago = signal<MedioPago>({} as MedioPago);
  bancos = signal<Banco[]>([]);
  medios = signal<MedioPago[]>([]);

  public importeAbonado = computed(() => this.detalles().reduce((total, detalle) => total + detalle.importeAbonado, 0) ?? 0);
  public importeCobrado = computed(() => this.detalles().reduce((total, detalle) => total + detalle.importeCobrado, 0) ?? 0);
  public diferecia = computed(() => this.importeTotal - this.importeAbonado() ?? 0);
  public vuelto = computed(() => this.importeAbonado() - this.importeCobrado() ?? 0);

  cobranzaForm: FormGroup;

  private fb = inject(FormBuilder)
  private _cobranzaService = inject(CobranzaService);
  private _bancoService = inject(BancoService);
  private _medioPagoService = inject(MedioPagoService);

  constructor() {
    // Initialize the property in the constructor
    this.cobranzaForm = this.initForm();
    forkJoin([
      this._bancoService.findAll(),
      this._medioPagoService.findAll(),

    ]).subscribe(([bancos, medios]) => {
      this.bancos.set(bancos);
      this.medios.set(medios);
    });
  }



  initForm() {
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
    });
  }

  ngOnInit(): void {

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
      this.cobranzaForm.get('nroCuenta')?.setValidators([Validators.required, Validators.minLength(4)]);
    }

    ['bancoId', 'fechaEmision', 'fechaVencimiento', 'nroRef', 'nroCuenta'].forEach(controlName => {
      this.cobranzaForm.get(controlName)?.updateValueAndValidity();
    });
  }


  onSubmit(e: Event) {
    e.preventDefault();

    const data = this.cobranzaForm.value;
    console.log(data);

    let importeCobrado = 0;
    let saldo = 0;
    if (this.importeTotal > data.importeAbonado) {
      importeCobrado = data.importeAbonado;
      saldo = Math.round(data.importeAbonado - importeCobrado);
    } else if (this.importeTotal == data.importeAbonado) {
      importeCobrado = data.importeAbonado;
      saldo = Math.round(data.importeAbonado - importeCobrado);
    } else if (this.importeTotal < data.importeAbonado) {
      importeCobrado = this.importeTotal;
      saldo = Math.round(importeCobrado - data.importeAbonado);
    }
    const detall: CobranzaDetalle = {
      id: 0,
      bancoId: data.bancoId,
      fechaEmision: data.fechaEmision,
      fechaVencimiento: data.fechaVencimiento,
      importeAbonado: data.importeAbonado,
      importeCobrado: importeCobrado,
      medioPagoId: data.medioPagoId,
      nroCuenta: data.nroCuenta,
      nroRef: data.nroRef,
      saldo: saldo,
      cobranzaId: 0
    }

    this.detalles.set([...this.detalles(), detall])
    // Procesar los datos del formulario (enviar a servidor, guardar, etc.)

    // Si deseas limpiar el formulario después del envío:
    this.cobranzaForm = this.initForm();
    this.medioPago.set({} as MedioPago)
  }
  selectCobranza(cobranza: Cobranza) {
    this.cobranza.emit(cobranza);
  }


  obtenerDescrip(id: number) {
    const medioPag = this.medios().find(medio => medio.id === id)

    return medioPag?.descripcion;
  }

  onMedioPagoChange(id: number) {
    // Limpia las validaciones existentes antes de aplicar las nuevas
    this.clearValidators();
    const medioPagoEncontrado = this.medios().find(m => m.id === id);
    if (medioPagoEncontrado) {
      this.medioPago.set(medioPagoEncontrado);

      // Aplica las nuevas validaciones
      this.applyValidators();
    }
  }
  quitar(index: number) {
    if (index !== -1) {
      this.detalles().splice(index, 1);
    }
  }
  close() {
    this.closeModal.emit();
  }


  enviar() {
 if (this.diferecia() > 0) {
  return;
 }
    const cobranza = {
      id: 0,
      empresaId: 0,
      sucursalId: this.sucursalId,
      usuarioCreacionId: this.userId,
      fechaCobranza: moment(new Date()).format("YYYY-MM-DD"),
      importeAbonado: this.importeAbonado(),
      importeCobrado: this.importeTotal,
      saldo: this.diferecia(),
      anulado: false,
      usuarioAnulacionId: null,
      fechaAnulacion: null,
      tipo: this.tipo,
      detalle: this.detalles(),

    }
    this.cobranza.emit(cobranza);
  }

}
