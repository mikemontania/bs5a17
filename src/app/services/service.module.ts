import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  ClientesService,
ProductosService,
VentasService,
FormaVentaService,
ListaPrecioService,
SucursalService,
NumeracionService,
ValoracionService,
CalculoService,
ReportesService
} from './service.index';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    ClientesService,
    ProductosService,
    VentasService,
    FormaVentaService,
    ListaPrecioService,
    SucursalService,
    NumeracionService,
    ValoracionService,
CalculoService,
ReportesService
  ],
  declarations: []
})
export class ServiceModule { }

