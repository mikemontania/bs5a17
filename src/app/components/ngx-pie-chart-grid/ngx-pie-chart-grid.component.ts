import { Component, OnDestroy, Input } from '@angular/core';

@Component({
  selector: 'ngx-pie-chart-grid',
  templateUrl: './ngx-pie-chart-grid.component.html',
  styleUrls: ['./ngx-pie-chart-grid.component.css']
})
export class NGXPieGridComponent  implements OnDestroy  {
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
