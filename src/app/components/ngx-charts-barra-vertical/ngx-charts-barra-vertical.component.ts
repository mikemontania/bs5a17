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
  // results: any[] = [
  //   {
  //     "name": "Juego 1",
  //     "value": 20
  //   },
  //   {
  //     "name": "Juego 2",
  //     "value": 25
  //   },
  //   {
  //     "name": "Juego 3",
  //     "value": 15
  //   },
  //   {
  //     "name": "Juego 4",
  //     "value": 30
  //   }
  // ];


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

    // this.intervalo = setInterval( () => {
    //   console.log('tick');

    //   const newResults = [...this.results];

    //   for( let i in newResults ) {
    //     newResults[i].value = Math.round( Math.random() * 500 )
    //   }

    //   this.results = [...newResults];

    // }, 1500 );

  }

  onSelect(event:any) {
    console.log(event);
  }

  ngOnDestroy() {
    // clearInterval( this.intervalo );
  }

}
