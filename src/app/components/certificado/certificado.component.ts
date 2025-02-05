

import { CommonModule } from '@angular/common';
import { Component, signal, inject, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import Swal from 'sweetalert2';
import { Location } from '@angular/common';

import { PaginatorComponent } from '../paginator/paginator.component';
import { EmpresaService } from '../../services/empresas.service';
import { forkJoin } from 'rxjs';
import { FileUploadService } from '../../services/service.index';

@Component({
  selector: 'app-certificado',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginatorComponent, ReactiveFormsModule],
  templateUrl: "./certificado.component.html",
  styleUrl: "./certificado.component.css"
})
export class CertificadoComponent implements OnInit {
  @Input() empresaId!: number;
  certificadoForm!: FormGroup;
  public p12Subir: (File | null)[] = [];
  public p12Temps: any[] = [];


   subiendo: boolean = false;

//01 primero obtener si existe registro de certificado si no existe crear vacio y presentar formulario vacio
//el caso del adjunto de certificado , lo que se podria hacer es mostrar en un string que un certificado esta cargado si hay path y si no lo hay que no existe
// al adjuntar el mismo creo que es necesario que se guarde y actualice el formulario


  constructor(
    private fb: FormBuilder,
    private _empresaService: EmpresaService,
    private _fileUploadService: FileUploadService
  ) {

  }

  ngOnInit(): void {
    this.certificadoForm = this.fb.group({
      id: [0, Validators.required],
      validoDesde: ['', Validators.required],
      validoHasta: ['', Validators.required],
      path: [''],
      passphrase: [''],
    });
    this.init()
  }

  init() {
    forkJoin([
      this._empresaService.getCertificado()
    ]).subscribe(([certificado ]) => {
      console.log(certificado)
      this.certificadoForm.patchValue(certificado);
    });
  }



  guardarCertificado() {

    this.subiendo = true;

    console.log(this.certificadoForm.value)

    this._empresaService.updateCertificado(this.certificadoForm.value).subscribe({
      next: async (certificado: any) => {
        const path = await this.subirArchivo();
        console.log(path)
        this.certificadoForm.patchValue({...certificado,path}); // Guardamos la info recibida
        this.subiendo = false;
        Swal.fire("Éxito", "Certificado guardado correctamente", "success");
      },
      error: () => {
        Swal.fire("Error", "No se pudo guardar certificado", "error");
        this.subiendo = false;
      }
    });
  }


  actualizarArchivo(event: any) {

    this.p12Subir[0] = event.target.files[0];

    if (!this.p12Subir[0]) {
      this.p12Temps[0] = null;
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.p12Subir[0]!);

    reader.onloadend = () => {
      this.p12Temps[0] = reader.result;
    };
  }

  subirArchivo(): Promise<string> {
    console.log("subiendo p12")
    return new Promise((resolve, reject) => {
      if (this.p12Subir[0]) {
        this._fileUploadService.actualizarp12(this.p12Subir[0]!,   this.certificadoForm.get('id')?.value).subscribe(
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
        resolve('');
      }
    });
  }
}
