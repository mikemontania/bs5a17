import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import {
  ClientesService,
  ProductosService,
 DocumentosService,
  CondicionPagoService,
  ListaPrecioService,
  SucursalService,
  NumeracionService,
  ValoracionService,
  CalculoService,
  ReportesService,SifenService,
  MedioPagoService, BancoService,EstablecimientoService,
  CobranzaService,FileUploadService,
  UsuariosService,EmpresaService,EntidadesService,AuditoriaService,TablaSifenService
} from './service.index';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    ClientesService,
    ProductosService,
   DocumentosService,
    CondicionPagoService,
    ListaPrecioService,
    SucursalService,
    NumeracionService,
    ValoracionService,
    CalculoService,
    ReportesService,SifenService,
    MedioPagoService, BancoService,
    CobranzaService,FileUploadService,EstablecimientoService,
    UsuariosService,EmpresaService,EntidadesService,AuditoriaService,TablaSifenService
  ],
  declarations: []
})
export class ServiceModule { }

