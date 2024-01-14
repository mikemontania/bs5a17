import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VentasService } from '../../../services/ventas.service';

@Component({
  standalone: true,
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  venta: any; // Almacenará la información de la venta

  constructor(private activatedRoute: ActivatedRoute, private ventasService: VentasService) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = params.get('id') ?? 0; // Maneja la posibilidad de valor nulo
      console.log(id)
      if (id) {
        this.ventasService.getById(+id).subscribe({
          next: (resp) => {
            this.venta = resp; // Guarda la respuesta en la propiedad venta
          },
          error: message => {
            console.error(message);
            // Maneja el error de forma adecuada (por ejemplo, mostrando un mensaje al usuario)
          }
        });
      }
    });
  }
}
