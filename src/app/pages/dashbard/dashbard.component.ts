import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import moment from 'moment';
import { SucursalService } from '../../services/sucursal.service';
import { Sucursal } from '../../interfaces/sucursal.interface';
import { ReportesService } from '../../services/reportes.service';
import { forkJoin } from 'rxjs';
import { ReporteCliente, ReporteMedioPago, ReporteSucursal, ReporteVariante, ReporteVendedor } from '../../interfaces/reports.interface';
import { NgxBarraVerticalComponent } from '../../components/ngx-charts-barra-vertical/ngx-charts-barra-vertical.component';
import { NGXPieComponent } from '../../components/ngx-charts-pie/ngx-charts-pie.component';
import { NGXPieAdvancedComponent } from '../../components/ngx-pie-chart-advanced/ngx-pie-chart-advanced.component';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-dashbard',
  standalone: true,
  imports: [CommonModule, FormsModule, NGXPieComponent, NGXPieAdvancedComponent, NgxBarraVerticalComponent],
  templateUrl: './dashbard.component.html',
  styleUrl: './dashbard.component.css'
})
export class DashbardComponent implements OnInit {
  fechaDesde = moment(new Date()).format("YYYY-MM-DD");
  fechaHasta = moment(new Date()).format("YYYY-MM-DD");
  rptSucursales: ReporteSucursal[] = [];
  rptVariantes: ReporteVariante[] = [];
  rptClientes: ReporteCliente[] = [];
  rptMediosPago: ReporteMedioPago[] = [];
  rptVendedores: ReporteVendedor[] = [];
  chatResulsSucursales: any[] = [];
  chatResulsVariantes: any[] = [];
  chatResulsClientes: any[] = [];
  chatResulsMediosPago: any[] = [];
  chatResulsVendedores: any[] = [];
  cargadoSucursales: boolean = false;
  cargadoVariantes: boolean = false;
  cargadoClientes: boolean = false
  cargadoMediosPago: boolean = false;
  cargadoVendedores: boolean = false;
  role: string = '';

  sucursalSeleccionada: number = 0; // Valor predeterminado
  sucursales: Sucursal[] = [];
  legendTitle: string = '';
  dashTema = 'night';

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = false;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';
  public temas: string[] = ['vivid', 'natural', 'cool', 'fire', 'solar',
    'air', 'aqua', 'flame', 'ocean', 'forest', 'horizon',
    'neons', 'picnic', 'night', 'nightLights']
  _authService = inject(AuthService);
  _sucursalesService = inject(SucursalService);
  _reportService = inject(ReportesService);

  dashvariante_totalimporte:number=0;
  dashcliente_totalimporte:number=0;
  dashcliente_totalfacturas:number=0;
  dashsucursal_totalimporte:number=0;
  dashsucursal_totalventas:number=0;
  dashvariante_peso:number=0;
  dashvariante_vendidos:number=0;
  dashmedio_importeCobrado:number=0;
  dashmedio_cantidad:number=0;
  dashvend_peso:number=0;
  dashvend_total:number=0;
  dashvend_cantidad:number=0;

  constructor() {
    this.cargadoSucursales = false;
    this.cargadoVariantes = false;
    this.cargadoClientes = false
    this.cargadoMediosPago = false;
    this.cargadoVendedores = false;
    this._sucursalesService.findAll().subscribe(resp => this.sucursales = resp);

  }

  ngOnInit() {
    this.role = this._authService.currentUser()!.rol;
    if (this.role =='admin') {
      this.sucursalSeleccionada =0;
    }else{
      this.sucursalSeleccionada = this._authService.currentUser()!.sucursalId;
    }
    this.getReport()
  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }


  getReport() {
    this.cargadoSucursales = false;
    this.cargadoVariantes = false;
    this.cargadoClientes = false
    this.cargadoMediosPago = false;
    this.cargadoVendedores = false;
    console.log(this.sucursalSeleccionada)
    if (!this.sucursalSeleccionada) {
      this.sucursalSeleccionada = 0;
    }
    if (!this.fechaDesde) {
      this.fechaDesde = moment(new Date()).format("YYYY-MM-DD");
    }
    if (!this.fechaHasta) {
      this.fechaHasta = moment(new Date()).format("YYYY-MM-DD");
    }
    forkJoin([
      this._reportService.getReporteVentasPorSucursal(this.fechaDesde, this.fechaHasta, this.sucursalSeleccionada),
      this._reportService.getTopVariantes(this.fechaDesde, this.fechaHasta, this.sucursalSeleccionada),
      this._reportService.getTopClientes(this.fechaDesde, this.fechaHasta, this.sucursalSeleccionada),
      this._reportService.getInformeMediosDePago(this.fechaDesde, this.fechaHasta, this.sucursalSeleccionada),
      this._reportService.getVendedoresPorTotal(this.fechaDesde, this.fechaHasta, this.sucursalSeleccionada),

    ]).subscribe(async ([rptSucursales, rptVariantes, rptClientes, rptMediosPago, rptVendedores]) => {
      console.log({ rptSucursales, rptVariantes, rptClientes, rptMediosPago, rptVendedores })
      this.rptSucursales = rptSucursales;//
      this.rptVariantes = rptVariantes;//
      this.rptClientes = rptClientes;//
      this.rptMediosPago = rptMediosPago;//
      this.rptVendedores = rptVendedores;//

      this.chatResulsSucursales = await rptSucursales.map((suc: ReporteSucursal) => { return { ...suc, name: suc.sucursalnombre, value: +suc.totalimporte } })
      this.chatResulsVariantes = await rptVariantes.map((va: ReporteVariante) => { return { ...va, name: va.producto + ' ' + va.variedad + ' ' + va.presentacion, value: +va.totalimporte } });
      this.chatResulsClientes = await rptClientes.map((cli: ReporteCliente) => { return { ...cli, name: cli.razonsocial + ' ' + cli.doc, value: +cli.totalimporte } })
      this.chatResulsMediosPago = await rptMediosPago.map((med: ReporteMedioPago) => { return { ...med, name: med.mediopago, value: +med.totalimportecobrado } })
      this.chatResulsVendedores = await rptVendedores.map((ven: ReporteVendedor) => { return { ...ven, name: ven.vendedor, value: +ven.total } })

      console.log(this.chatResulsSucursales)
      console.log(this.chatResulsVariantes)
      console.log(this.chatResulsClientes)
      console.log(this.chatResulsMediosPago)
      console.log(this.chatResulsVendedores)
      this.sumTotales();
      this.cargadoSucursales = true;
      this.cargadoVariantes = true;
      this.cargadoClientes = true
      this.cargadoMediosPago = true;
      this.cargadoVendedores = true;

    });



  }
  onSeleccionMedioPago(event: any) { console.log(event) }
  onSeleccionSucursal(event: any) { console.log(event) }
  onSeleccionVendedor(event: any) { console.log(event) }
  onSeleccionVariante(event: any) { console.log(event) }
  onSeleccionCliente(event: any) { console.log(event) }
  sumTotales(){
    this.dashmedio_importeCobrado =  this.rptMediosPago.reduce((total, detalle) => total + +detalle.totalimportecobrado, 0) ;
    this.dashsucursal_totalimporte =  this.rptSucursales.reduce((total, detalle) => total + +detalle.totalimporte, 0) ;
    this.dashcliente_totalimporte =  this.rptClientes.reduce((total, detalle) => total + +detalle.totalimporte, 0) ;
    this.dashcliente_totalfacturas =  this.rptClientes.reduce((total, detalle) => total + +detalle.totalfacturas, 0) ;
    this.dashsucursal_totalventas =  this.rptSucursales.reduce((total, detalle) => total + +detalle.totalventas, 0) ;
    this.dashvariante_totalimporte =  this.rptVariantes.reduce((total, detalle) => total + +detalle.totalimporte, 0) ;
    this.dashvariante_peso =  this.rptVariantes.reduce((total, detalle) => total + +detalle.peso, 0) ;
    this.dashvariante_vendidos =  this.rptVariantes.reduce((total, detalle) => total + +detalle.vendidos, 0) ;
    this.dashmedio_cantidad =  this.rptMediosPago?.length || 0 ;
    this.dashvend_peso =  this.rptVendedores.reduce((total, detalle) => total + +detalle.peso, 0) ;
    this.dashvend_total =  this.rptVendedores.reduce((total, detalle) => total + +detalle.total, 0) ;
    this.dashvend_cantidad =  this.rptVendedores.reduce((total, detalle) => total + +detalle.cantidad, 0) ;
  }

}
