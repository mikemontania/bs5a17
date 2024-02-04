import { Component, OnDestroy, Input } from '@angular/core';

@Component({
  selector: 'ngx-charts-barra-horizontal',
  templateUrl: './ngx-charts-barra-horizontal.component.html',
  styleUrls: ['./ngx-charts-barra-horizontal.component.css']
})
export class NGXBarraHorizontalComponent implements OnDestroy {
  @Input() results: any[] = [];
  @Input() legendTitle: string = '';
  @Input() dashTema = 'night';
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
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Juegos';
  showYAxisLabel = true;
  yAxisLabel = 'Votos';


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
