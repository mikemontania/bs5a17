import { CommonModule } from "@angular/common";
import { Component, OnInit, signal, inject } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { forkJoin } from "rxjs";
import Swal from "sweetalert2";
import { AuthService } from "../../auth/services/auth.service";
import { Numeracion } from "../../interfaces/numeracion.interface";
import { Sucursal } from "../../interfaces/sucursal.interface";
import { ImagenPipe } from "../../pipes/imagen.pipe";
import { FileUploadService } from "../../services/file-upload.service";
import { SucursalService } from "../../services/sucursal.service";
import { UsuariosService } from "../../services/usuarios.service";
import { Location } from '@angular/common';
import { EmpresaService } from "../../services/empresas.service";

@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, ImagenPipe],
  templateUrl: './empresa.component.html',
  styleUrl: './empresa.component.css'
})
export class EmpresaComponent implements OnInit {
  sinImagen: string = '../../../../assets/no-img.jpg';
  public imagenesSubir: (File | null)[] = [];
  public imgTemps: any[] = [];

  empresaForm: FormGroup;
  private fb = inject(FormBuilder)
  private _authService = inject(AuthService)
  private _empresaService = inject(EmpresaService)
  private location = inject(Location)
  private _fileUploadService = inject(FileUploadService);
  private router = inject(Router);
  private _usuarioService = inject(UsuariosService)
  private activatedRoute = inject(ActivatedRoute);


  constructor() {
    // Initialize the property in the constructor
    this.empresaForm = this.initForm()

    forkJoin([
      this._empresaService.getById(this._authService.currentUser()?.empresaId!),

    ]).subscribe(([empresa]) => {
      this.empresaForm.patchValue(empresa);
    });

  }



  ngOnInit() {

  }


  initForm() {
    return this.fb.group({
      id: [null],
      razonSocial: [null, Validators.required],
      actividad1: [null],
      actividad2: [null],
      actividad3: [null],
      ruc: [null, Validators.required],
      telefono: [null],
      email: [null, [Validators.required, Validators.email]],
      img: [''],
      web: [null],
    });
  }
  onSubmit(e: Event) {
    e.preventDefault()
    const empresaData = this.empresaForm.value;
    Swal.showLoading();

    if (  empresaData?.razonSocial === '' ||empresaData?.razonSocial === null) {
      Swal.fire("Error", 'Las Razon social es un campo obligatorio', "error");
      return;
    }
    if (  empresaData?.ruc === '' ||empresaData?.ruc === null) {
      Swal.fire("Error", 'Las Ruc es un campo obligatorio', "error");
      return;
    }


      this._empresaService.update(empresaData).subscribe({
        next: async (resp) => {
          const img = await this.subirImagen(resp.id);
          this.empresaForm.patchValue({ ...empresaData, img });
          Swal.close()
          Swal.fire("Actualización exitosa!!!", "Ok !!!"  , "success");
          this.router.navigateByUrl('/usuarios');
        },
        error: (error) => {
          Swal.close()
          Swal.fire("Error", error, "error");
        },
        complete: () => {
          this.empresaForm = this.fb.group({});
        }// Use 'complete' instead of 'finally'
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
