import { Component, OnDestroy, Input } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  standalone:true,
  imports:[
    NgxChartsModule,
    ],
  selector: 'ngx-charts-barra-vertical',
  templateUrl: './ngx-charts-barra-vertical.component.html',
  styleUrls: ['./ngx-charts-barra-vertical.component.css']
})
export class NgxBarraVerticalComponent implements OnDestroy {
  @Input() legendTitle: string = '';
  @Input() dashTema = 'night';
  @Input() results: any[] = [];
  // options
  showXAxis  = false;
  showYAxis  = true;
  gradient   = true;
  showLegend = true;
  showXAxisLabel = false;
  xAxisLabel = 'Top';
  showYAxisLabel = false;
  yAxisLabel = 'Productos';


  // intervalo;

  constructor() {


  }

  onSelect(event:any) {
    console.log(event);
  }

  ngOnDestroy() {
    // clearInterval( this.intervalo );
  }

}
