import { Component, OnInit, inject, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ListaPrecioService } from '../../../services/listaPrecio.service';
import { CondicionPagoService } from '../../../services/condicionPago.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { ListaPrecio } from '../../../interfaces/listaPrecio.interface';
import { CondicionPago } from '../../../interfaces/condicionPago.interface';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Usuario } from '../../../interfaces/usuario.interface';
import { SucursalService } from '../../../services/sucursal.service';
import { NumeracionService } from '../../../services/numeracion.service';
import { Sucursal } from '../../../interfaces/sucursal.interface';
import { Numeracion } from '../../../interfaces/numeracion.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { FileUploadService } from '../../../services/file-upload.service';
import { Location } from '@angular/common';
import { ImagenPipe } from '../../../pipes/imagen.pipe';
@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, ImagenPipe],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent implements OnInit {
  sinImagen: string = '../../../../assets/no-img.jpg';
  public imagenesSubir: (File | null)[] = [];
  public imgTemps: any[] = [];
  id = signal<number>(0)
  sucursales = signal<Sucursal[]>([])
  numeraciones = signal<Numeracion[]>([])
  numeracionesNc = signal<Numeracion[]>([])
  usuarioForm: FormGroup;
  private fb = inject(FormBuilder)
  private _authService = inject(AuthService)
  private _sucursalService = inject(SucursalService)
  private _numeracionService = inject(NumeracionService)
  private location = inject(Location)
  private _fileUploadService = inject(FileUploadService);
  private router = inject(Router);
  private _usuarioService = inject(UsuariosService)
  private activatedRoute = inject(ActivatedRoute);
  constructor() {
    // Initialize the property in the constructor
    this.usuarioForm = this.initForm()

    forkJoin([
      this._sucursalService.findAll(),
    ]).subscribe(([sucursales]) => {
      this.sucursales.set(sucursales);
    });

  }

  async sucursalChange(sucursalId: number) {
    this.resetNumeraciones(sucursalId).then(() => {

    });
  }

  formattedUltimoNumero(ultimoNumero: number) {
    console.log(ultimoNumero)
    return `${String(ultimoNumero).padStart(8, '0')}`;
  }

  private resetNumeraciones(sucursalId: number): Promise<void> {
    return new Promise((resolve) => {
      this.numeraciones.set([]);
      this.numeracionesNc.set([]);
      this.usuarioForm.controls['numPrefId'].patchValue(null);
      this.usuarioForm.controls['numNcPrefId'].patchValue(null);

      forkJoin([
        this._numeracionService.findAll(sucursalId, 1),
        this._numeracionService.findAll(sucursalId, 6)
      ]).subscribe(([numFactura, numNotaCred]) => {
        this.numeraciones.set(numFactura || []);
        this.numeracionesNc.set(numNotaCred || []);
        resolve(); // Solo cuando se completan los datos, resolvemos la promesa
      });
    });
  }


  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log(id);
      if (id) {
        this.id.set(+id ?? 0);
        this._usuarioService.getById(this.id()).subscribe({
          next: (usuarioData) => {
            this.resetNumeraciones(usuarioData.sucursalId).then(() => {
              this.usuarioForm.patchValue(usuarioData);
            });
          },
          error: message => {
            console.error(message);
          }
        });
      } else {
        this.updateFormForCreate();
      }
    });
  }
  updateFormForEdit() {
    this.usuarioForm.get('password1')?.clearValidators();
    this.usuarioForm.get('password2')?.clearValidators();
    this.usuarioForm.get('password1')?.updateValueAndValidity();
    this.usuarioForm.get('password2')?.updateValueAndValidity();
  }
  updateFormForCreate() {
    this.usuarioForm.get('password1')?.setValidators(Validators.required);
    this.usuarioForm.get('password2')?.setValidators(Validators.required);
    this.usuarioForm.get('password1')?.updateValueAndValidity();
    this.usuarioForm.get('password2')?.updateValueAndValidity();
  }
  initForm() {
    return this.fb.group({
      empresaId: [1, Validators.required],
      sucursalId: [null, Validators.required],
      numPrefId: [null],
      numNcPrefId: [null],
      rol: [null, Validators.required],
      usuario: [null, [Validators.required, Validators.minLength(3)]],
      img: [''],
      password1: [null],
      password2: [null],
      username: [null, [Validators.required, Validators.email]],
      activo: [true],
      bloqueado: [false]
    });
  }
  onSubmit(e: Event) {
    e.preventDefault()
    if (this.usuarioForm.invalid) {
      console.log(this.usuarioForm)
      this.usuarioForm.markAllAsTouched();

      // Log the errors to the console
      console.log(this.getFormErrors());

      return;
    }
    const usuarioData = this.usuarioForm.value;
    Swal.showLoading();

    // Verificar que las contraseñas coincidan y no estén vacías
    if (usuarioData?.password1 !== usuarioData?.password2 || usuarioData?.password1 === '') {
      Swal.fire("Error", 'Las contraseñas no coinciden o están vacías', "error");
      return;
    }
    // Asignar el valor de password1 al campo password
    usuarioData.password = usuarioData.password1;
    console.log(usuarioData)
    if (this.id()) {
      const usuario = {
        ...usuarioData,
        id: this.id()
      }

      this._usuarioService.update(usuario).subscribe({
        next: async (resp) => {
          const img = await this.subirImagen(resp.id);
          this.usuarioForm.patchValue({ ...usuario, img });
          Swal.close()
          Swal.fire("Actualización exitosa!!!", "Se ha actualizado al usuario: " + resp.razonSocial, "success");
          this.router.navigateByUrl('/usuarios');
        },
        error: (error) => {
          Swal.close()
          Swal.fire("Error", error, "error");
        },
        complete: () => {
          this.usuarioForm = this.fb.group({});
        }// Use 'complete' instead of 'finally'
      });
    } else {


      this._usuarioService.create(usuarioData).subscribe({
        next: async (resp) => {
          const img = await this.subirImagen(resp.id)
          Swal.close()
          Swal.fire("Creación exitosa!!!", "Se ha registrado el usuario " + resp.username, "success");
          this.router.navigateByUrl('/usuarios');
        },
        error: (error) => {
          Swal.close()
          Swal.fire("Error", error, "error");
        },
        complete: () => {
          this.usuarioForm = this.fb.group({});
        }// Use 'complete' instead of 'finally'
      });
    }

  }
  getFormErrors() {
    const errors: { field: string; errors: any }[] = [];

    Object.keys(this.usuarioForm.controls).forEach(key => {
      const control = this.usuarioForm.get(key);
      if (control && control.invalid && (control.touched || control.dirty)) {
        errors.push({ field: key, errors: control.errors });
      }
    });

    return errors;
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
    return new Promise((resolve, reject) => {
      if (this.imagenesSubir[0]) {
        this._fileUploadService.actualizarFoto(this.imagenesSubir[0]!, 'usuarios', id).subscribe(
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
