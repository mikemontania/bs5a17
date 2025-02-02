import { CommonModule } from "@angular/common";
import { Component, OnInit, signal, inject } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { forkJoin } from "rxjs";
import Swal from "sweetalert2";
import { AuthService } from "../../auth/services/auth.service";
import { ImagenPipe } from "../../pipes/imagen.pipe";
import { FileUploadService } from "../../services/file-upload.service";
import { UsuariosService } from "../../services/usuarios.service";
import { Location } from '@angular/common';
import { EmpresaService } from "../../services/empresas.service";
import { TablaSifenService } from "../../services/tablaSifen.service";
import { EstablecimientoService } from "../../services/establecimiento.service";
import { ActividadComponent } from "../../components/actividad/actividad.component";

@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, ImagenPipe,ActividadComponent],
  templateUrl: './empresa.component.html',
  styleUrl: './empresa.component.css'
})
export class EmpresaComponent implements OnInit {
  sinImagen: string = '../../../../assets/no-img.jpg';
  public imagenesSubir: (File | null)[] = [];
  public imgTemps: any[] = [];
  actividadesDisponibles: any[] = [];
  contribuyentes: any[] = [];
  transacciones: any[] = [];
  impuestos: any[] = [];

  departamentos: any[] = [];
  ciudades: any[] = [];
  barrios: any[] = [];


  empresaForm: FormGroup;
  private fb = inject(FormBuilder)
  private _authService = inject(AuthService)
  private _empresaService = inject(EmpresaService)
  private _tablaSifenService = inject(TablaSifenService)
  private _establecimiento = inject(EstablecimientoService)
  private location = inject(Location)
  private _fileUploadService = inject(FileUploadService);
  private router = inject(Router);
  private _usuarioService = inject(UsuariosService)
  private activatedRoute = inject(ActivatedRoute);


  constructor() {
    // Initialize the property in the constructor
    this.empresaForm = this.initForm()

    this.init()

  }


  onChangeCodDepartamento(): void {
    this.empresaForm.get('codDepartamento')?.valueChanges.subscribe(value => {
      if (value) {
        forkJoin([
          this._establecimiento.getCiudades(value),
        ]).subscribe(([ciudades]) => {
          console.log(ciudades)
          this.ciudades = ciudades;
          //si ya hay
          if (this.empresaForm.get('codCiudad')?.value) {
            //verificar sie el codigo de ciudad esta en el de array obtenido
            // si es asi es porque se esta mostrando el formulario guardado, si no esta es porque se hizo un cambio de  departamentos
            const existe = ciudades.some((ciudad: any) => ciudad.codigo === this.empresaForm.get('codCiudad')?.value);
            if (existe) {// no hacer nada ya que se esta mostrando formulario guardado
            } else {//se asigna el primer elemento
              this.empresaForm.get('codCiudad')?.setValue(ciudades[0].codigo);
            }
          } else {// si no hay asignar el primero
            this.empresaForm.get('codCiudad')?.setValue(ciudades[0].codigo);
          }

        });
      }
    });
  }
  onChangeCodCiudad(): void {
    this.empresaForm.get('codCiudad')?.valueChanges.subscribe(value => {
      if (value) {
        forkJoin([
          this._establecimiento.getBarrios(value),
        ]).subscribe(([barrios]) => {
          console.log(barrios)
          this.barrios = barrios;
          //si ya hay codBarrio
          if (this.empresaForm.get('codBarrio')?.value) {
            //verificar si el codigo de barrio esta en el de array obtenido
            // si es asi es porque se esta mostrando el formulario guardado, si no esta es porque se hizo un cambio de  ciuadad
            const existe = barrios.some((barrios: any) => barrios.codigo === this.empresaForm.get('codBarrio')?.value);
            if (existe) {// no hacer nada ya que se esta mostrando formulario guardado
            } else {//se asigna el primer elemento
              this.empresaForm.get('codBarrio')?.setValue(barrios[0].codigo);
            }
          } else {// si no hay asignar el primero
            this.empresaForm.get('codBarrio')?.setValue(barrios[0].codigo);
          }
        });
      }
    });
  }


  seleccionCiudad() {

  }

  ngOnInit() {
    this.onChangeCodDepartamento();
    this.onChangeCodCiudad();
  }
  init() {
    forkJoin([
      this._empresaService.getById(this._authService.currentUser()?.empresaId!),
      this._empresaService.getActividades(),
      this._tablaSifenService.findAllrecords('iTipCont'),
      this._tablaSifenService.findAllrecords('iTipTra'),
      this._tablaSifenService.findAllrecords('iTImp'),
      this._establecimiento.getDepartamentos(),
    ]).subscribe(([empresa, actividades, contribuyentes, transacciones, impuestos, departamentos]) => {
      console.log(empresa)
      console.log(actividades)
      console.log(contribuyentes)
      console.log(transacciones)
      console.log(impuestos)
      this.empresaForm.patchValue(empresa);
      this.actividadesDisponibles = actividades;
      this.contribuyentes = contribuyentes;
      this.transacciones = transacciones;
      this.impuestos = impuestos;
      this.departamentos = departamentos;
    });
  }

  private initForm() {
    return this.fb.group({
      id: [null],
      razonSocial: [null, [Validators.required, Validators.minLength(6)]],
      nombreFantasia: [''],
      ruc: [null, [Validators.required, Validators.pattern(/^\d{6,9}-\d{1}$/)]],
      moneda: [''],
      simboloMoneda: [''],
      codigoMoneda: [''],
      idCSC: [''],
      csc: [''],
      tipoContId: [null, Validators.required],
      tipoTransaId: [null, Validators.required],
      tipoImpId: [null, Validators.required],
      numCasa: [null, Validators.required],
      codDepartamento: [null, Validators.required],
      codCiudad: [null, Validators.required],
      codBarrio: [null, Validators.required],
      telefono: [''],
      email: ['', Validators.email],
      web: [null, [Validators.required, Validators.pattern(/^(https?:\/\/)?([\w\d-]+\.)+[a-z]{2,6}(\/[\w\d]*)*$/)]],
      img: [''],
    });
  }

  eliminarActividad(i:number){

  }
  getFormErrors() {
    const errors: { field: string; errors: any }[] = [];

    Object.keys(this.empresaForm.controls).forEach(key => {
      const control = this.empresaForm.get(key);
      if (control && control.invalid && (control.touched || control.dirty)) {
        errors.push({ field: key, errors: control.errors });
      }
    });

    return errors;
  }

  onSubmit(e: Event) {
    e.preventDefault()
    if (this.empresaForm.invalid) {
      this.empresaForm.markAllAsTouched();
      // Log the errors to the console
      console.log(this.getFormErrors());

      return;
    }
    const empresaData = this.empresaForm.value;
    Swal.showLoading();

    if (empresaData?.razonSocial === '' || empresaData?.razonSocial === null) {
      Swal.fire("Error", 'Las Razon social es un campo obligatorio', "error");
      return;
    }
    if (empresaData?.ruc === '' || empresaData?.ruc === null) {
      Swal.fire("Error", 'Las Ruc es un campo obligatorio', "error");
      return;
    }


    this._empresaService.update(empresaData).subscribe({
      next: async (resp) => {
        const img = await this.subirImagen(resp.id);

        Swal.close()
        Swal.fire("Actualización exitosa!!!", "Guardado con exito !!!", "success");
        // this.init()
      },
      error: (error) => {
        Swal.close()
        Swal.fire("Error", error, "error");
      }
    });


  }

  actualizarImagen(event: any, id: number) {

    this.imagenesSubir[0] = event.target.files[0];

    if (!this.imagenesSubir[0]) {
      this.imgTemps[0] = null;
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.imagenesSubir[0]!);

    reader.onloadend = () => {
      this.imgTemps[0] = reader.result;
    };
  }

  subirImagen(id: number): Promise<string> {
    console.log("subiendo imagen")
    return new Promise((resolve, reject) => {
      if (this.imagenesSubir[0]) {
        this._fileUploadService.actualizarFoto(this.imagenesSubir[0]!, 'empresas', id).subscribe(
          img => {
            const fileInput = document.getElementById('fileInput') as HTMLInputElement;
            if (fileInput) {
              fileInput.value = ''; // Limpiar el campo de entrada de archivos
            }
            console.log(img);
            // Swal.fire('Guardado', 'Imagen actualizada', 'success');
            resolve(img);
          },
          error => reject(error)
        );
      } else {
        resolve('No hay imagen para subir');
      }
    });
  }
  atras() {
    this.location.back();
  }

}
