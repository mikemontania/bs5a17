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
  ReportesService,
  MedioPagoService, BancoService,
  CobranzaService,FileUploadService,
  UsuariosService
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
    ReportesService,
    MedioPagoService, BancoService,
    CobranzaService,FileUploadService,
    UsuariosService
  ],
  declarations: []
})
export class ServiceModule { }

