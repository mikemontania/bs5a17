import { Component, OnDestroy, Input } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'ngx-pie-chart',
  standalone:true,
  imports:[NgxChartsModule],
  templateUrl: './ngx-charts-pie.component.html',
  styleUrls: ['./ngx-charts-pie.component.css']
})
export class NGXPieComponent  implements OnDestroy  {
  @Input() results: any[] = [];
  @Input() legendTitle: string = '';
  @Input() dashTema = 'night';

   gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = false;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';


  constructor() {}

  onSelect(data:any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  ngOnDestroy() {
    // clearInterval( this.intervalo );
  }
}
