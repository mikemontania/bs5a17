import { CommonModule } from "@angular/common";
import { Component,       EventEmitter, Input, OnInit, Output, ViewContainerRef, inject, signal } from "@angular/core";
import { InputDebounceComponent } from "../inputDebounce/inputDebounce.component";
import { Banco, Cobranza } from '../../interfaces/facturas.interface';
import { CobranzaService } from "../../services/cobranza.service";
import { BancoService } from '../../services/banco.service';
import { MedioPagoService } from "../../services/medioPago.service";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

@Component({
  selector: "app-cobranza-create",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,InputDebounceComponent],
  templateUrl: "./ng-cobranza-create.component.html",
  styleUrl: "./ng-cobranza-create.component.css"
})
export class NgCobranzaCreateComponent implements OnInit {
  size = "medium";
  delay=200;
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() cobranza = new EventEmitter<Cobranza>();

bancos = signal<Banco[]>([]);
medios = signal<Banco[]>([]);
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
      selectMedio: ['', Validators.required],
      selectModelTipoMedio: [''],
      selectBanco: [''],
      fechaEmision: [''],
      fechaVencimiento: [''],
      nroRef: ['', [Validators.required, Validators.minLength(4)]],
      nroCuenta: ['', [Validators.required, Validators.minLength(12)]],
      montoAbonado: ['', [Validators.required, Validators.min(100)]],
    });
  }



  onSubmit(e:Event) {
    e.preventDefault()
    const data: any = this.cobranzaForm.value;
console.log(data)

  }

  selectCobranza(cobranza: Cobranza) {
  this.cobranza.emit(cobranza);
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
