import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VentasService } from '../../../services/ventas.service';
import { Venta, VentaDetalle } from '../../../interfaces/facturas.interface';
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
  venta =signal<Venta>( {}as Venta); // Almacenará la información de la venta
  detalles=signal<VentaDetalle[]>([]as VentaDetalle[]);


  cargado = computed(() => (this.venta()?.id && this.detalles()?.length > 0 )?true:false);



  private location= inject(Location)
   private activatedRoute= inject(ActivatedRoute);
    private ventasService= inject(VentasService);

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = params.get('id') ?? 0; // Maneja la posibilidad de valor nulo
      console.log(id)
      if (id) {
        this.ventasService.getById(+id).subscribe({
          next: (resp) => {
            this.venta.set(resp.venta); // Guarda la respuesta en la propiedad venta
            this.detalles.set(resp.detalles);
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
