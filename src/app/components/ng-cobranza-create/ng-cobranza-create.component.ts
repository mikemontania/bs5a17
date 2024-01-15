import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef, inject, signal } from "@angular/core";
import { InputDebounceComponent } from "../inputDebounce/inputDebounce.component";
import { Banco, Cobranza, MedioPago } from '../../interfaces/facturas.interface';
import { CobranzaService } from "../../services/cobranza.service";
import { BancoService } from '../../services/banco.service';
import { MedioPagoService } from "../../services/medioPago.service";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Observable, of } from "rxjs";

@Component({
  selector: "app-cobranza-create",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputDebounceComponent],
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



  bancos = signal<Banco[]>([]);
  medios = signal<MedioPago[]>([]);

  medioPago = signal<MedioPago>({} as MedioPago);
  cobranzaForm: FormGroup;

  private fb = inject(FormBuilder)
  private _cobranzaService = inject(CobranzaService);
  private _bancoService = inject(BancoService);
  private _medioPagoService = inject(MedioPagoService);

  constructor() {
    // Initialize the property in the constructor
    this.cobranzaForm = this.fb.group({});
  }
  ngOnInit(): void {
    this.getBancos();
    this.getMediosPago();
    this.cobranzaForm = this.fb.group({
      fechaEmision: [null],
      fechaVencimiento: [null],
      importeAbonado: [null, Validators.required],
      importeCobrado: [null, Validators.required],
      nroCuenta: [null],
      nroRef: [null],
      saldo: [null, Validators.required],
      bancoId: [null],
      cobranzaId: [null, Validators.required],
      medioPagoId: [null, Validators.required],
      montoAbonado:[0]
    });

  }



  onSubmit(e: Event) {
    e.preventDefault()
    const data: any = this.cobranzaForm.value;
    console.log(data)

  }

  selectCobranza(cobranza: Cobranza) {
    this.cobranza.emit(cobranza);
  }

  onMedioPagoChange(id: number) {
    const medioPagoEncontrado = this.medios().find(m => m.id === id);
    if (medioPagoEncontrado) {
      this.medioPago.set(medioPagoEncontrado);
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
