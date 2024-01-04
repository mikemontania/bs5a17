import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  ClientesService,
ProductosService,
VentasService,
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
  ],
  declarations: []
})
export class ServiceModule { }
