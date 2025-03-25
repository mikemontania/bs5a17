import { Component, OnDestroy, Input } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  standalone: true,
  imports: [NgxChartsModule],
  selector: 'ngx-charts-barra-horizontal',
  templateUrl: './ngx-charts-barra-horizontal.component.html',
  styleUrls: ['./ngx-charts-barra-horizontal.component.css']
})
export class NGXBarraHorizontalComponent implements OnDestroy {
  @Input() legendTitle: string = '';
  @Input() dashTema = 'night';
  @Input() results: any[] = [];

  // Opciones del gráfico
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = false;
  showXAxisLabel = true;
  showYAxisLabel = true;
  xAxisLabel = '';
  yAxisLabel = '';

  constructor() {
    if (this.legendTitle != '') {
      this.yAxisLabel=this.legendTitle;
    }
  }

  onSelect(event: any) {
    console.log(event);
  }

  ngOnDestroy() {}
}
