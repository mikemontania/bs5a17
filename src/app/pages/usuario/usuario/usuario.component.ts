import { Component, OnInit, inject, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ListaPrecioService } from '../../../services/listaPrecio.service';
import { FormaVentaService } from '../../../services/formaVenta.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { ListaPrecio } from '../../../interfaces/listaPrecio.interface';
import { FormaVenta } from '../../../interfaces/formaventa.interface';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Usuario } from '../../../interfaces/usuario.interface';
import { SucursalService } from '../../../services/sucursal.service';
import { NumeracionService } from '../../../services/numeracion.service';
import { Sucursal } from '../../../interfaces/sucursal.interface';
import { Numeracion } from '../../../interfaces/numeracion.interface';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent implements OnInit {
  id = signal<number>(0)
  sucursales = signal<Sucursal[]>([])
  numeraciones = signal<Numeracion[]>([])
  usuarioForm: FormGroup ;
  private fb = inject(FormBuilder)
  private _authService = inject(AuthService)
  private _sucursalService = inject(SucursalService)
  private _numeracionService = inject(NumeracionService)
  private router = inject(Router);
  private _usuarioService = inject(UsuariosService)
  private activatedRoute= inject(ActivatedRoute);
  constructor() {
    // Initialize the property in the constructor
    this.usuarioForm = this.initForm()

    forkJoin([
      this._sucursalService.findAll(),
      this._numeracionService.findAll(0),

    ]).subscribe(([sucursales, numeraciones]) => {
      this.sucursales.set(sucursales);
      this.numeraciones.set(numeraciones);
    });

  }

sucursalChange(sucursalId:number){
  this.numeraciones.set([])
  console.log(this.usuarioForm.value);

  this._numeracionService.findAll(sucursalId).subscribe( (resp:any) =>{
    this.usuarioForm.controls['numPrefId'].patchValue(null);
    console.log(this.usuarioForm.value);

    this.numeraciones.set(resp)

  })

}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id')
      console.log(id)
      if ( id) {
        this.id.set(+id ?? 0); // Maneja la posibilidad de valor nulo
        this._usuarioService.getById( this.id()).subscribe({
          next: (usuarioData) => {
            this.usuarioForm.patchValue(usuarioData);

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
    sucursalId: [null, Validators.required],
    numPrefId: [null, Validators.required],
    rol: [null, Validators.required],
    usuario: [null, Validators.required],
    password1: [null, Validators.required],
    password2: [null, Validators.required],
    username: [null, [Validators.required, Validators.email]],
    activo: [true],
    bloqueado: [false]
  });
}
  onSubmit(e:Event) {
    e.preventDefault()
    const usuarioData: Usuario = this.usuarioForm.value;
    Swal.showLoading();




    if (this.id()) {
      const usuario = {
        ...usuarioData,
        id:this.id()
       }
      this._usuarioService.update(usuario).subscribe({
        next: (resp) => {
          Swal.close()
          Swal.fire("Actualización exitosa!!!", "Se ha actualizado al usuario: " + resp.razonSocial, "success");
          this.router.navigateByUrl('/usuarios');
        },
        error: (error) => {
          Swal.close()
          Swal.fire("Error", error.message, "error");
        },
        complete: () => {
          this.usuarioForm = this.fb.group({});
        }// Use 'complete' instead of 'finally'
      });
    } else {

      this._usuarioService.create(usuarioData).subscribe({
        next: (resp) => {
          Swal.close()
          Swal.fire("Creación exitosa!!!", "Se ha registrado el usuario " + resp.razonSocial, "success");
          this.router.navigateByUrl('/usuarios');
        },
        error: (error) => {
          Swal.close()
          Swal.fire("Error", error.message, "error");
        },
        complete: () => {
          this.usuarioForm = this.fb.group({});
        }// Use 'complete' instead of 'finally'
      });
    }

  }



}
