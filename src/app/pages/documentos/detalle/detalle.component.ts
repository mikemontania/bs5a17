import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {DocumentosService } from '../../../services/documentos.service';
import {Documento, DocumentoDetalle } from '../../../interfaces/facturas.interface';
import { CommonModule } from '@angular/common';
import { ImagenPipe } from '../../../pipes/imagen.pipe';
import { Location } from '@angular/common';

@Component({
  standalone: true,
  imports:[CommonModule, ImagenPipe],
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  documento =signal<Documento>( {}as Documento); // Almacenará la información de la documento
  detalles=signal<DocumentoDetalle[]>([]as DocumentoDetalle[]);


  cargado = computed(() => (this.documento()?.id   > 0 )?true:false);



  private location= inject(Location)
   private activatedRoute= inject(ActivatedRoute);
    private documentosService= inject(DocumentosService);

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = params.get('id') ?? 0; // Maneja la posibilidad de valor nulo
      console.log(id)
      if (id) {
        this.documentosService.getById(+id).subscribe({
          next: (resp) => {
            this.documento.set(resp.documento); // Guarda la respuesta en la propiedad documento
            this.detalles.set(resp.detalles || []);
          },
          error: message => {
            console.error(message);
            // Maneja el error de forma adecuada (por ejemplo, mostrando un mensaje al usuario)
          }
        });
      }
    });
  }



  volverAtras() {
    this.location.back();
  }
}
