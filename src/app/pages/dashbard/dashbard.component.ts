import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dashbard',
  standalone: true,
  imports: [CommonModule, FormsModule,NgxChartsModule],
  templateUrl: './dashbard.component.html',
  styleUrl: './dashbard.component.css'
})
export class DashbardComponent {
  fechaDesde: string = '';
  fechaHasta: string = '';
  sucursalSeleccionada: number = 1; // Valor predeterminado

 legendTitle: string = 'fsdfsdf';
     dashTema ='night';
   results: any[] = [
    {
      "name": "Germany",
      "value": 8940000
    },
    {
      "name": "USA",
      "value": 5000000
    },
    {
      "name": "France",
      "value": 7200000
    },
      {
      "name": "UK",
      "value": 6200000
    }
  ];

  // options
   gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = false;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';
  public temas: string[] = ['vivid', 'natural', 'cool', 'fire', 'solar',
  'air', 'aqua', 'flame', 'ocean', 'forest', 'horizon',
  'neons', 'picnic', 'night', 'nightLights']

  constructor() {}

  onSelect(data:any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }
  sucursales = [
    { id: 1, nombre: 'Sucursal 1' },
    { id: 2, nombre: 'Sucursal 2' }
  ];

  generarReportes() {
    // Aquí puedes llamar a tus servicios de reportes con las fechas y sucursal seleccionada
    // y manejar los datos para mostrar en los gráficos.
    console.log('Generando reportes...');
    console.log('Fecha Desde:', this.fechaDesde);
    console.log('Fecha Hasta:', this.fechaHasta);
    console.log('Sucursal Seleccionada:', this.sucursalSeleccionada);
    // Llama a tus servicios y actualiza los gráficos con los datos recibidos.
  }
}
