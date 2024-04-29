import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputDebounceComponent } from '../../../components/inputDebounce/inputDebounce.component';
import { PaginatorComponent } from '../../../components/paginator/paginator.component';
import { Sucursal } from '../../../interfaces/sucursal.interface';
import moment from 'moment';
import { NgSucursalSearchComponent } from '../../../components/ng-sucursal-search/ng-sucursal-search.component';
import { NgMedioPagoSearchComponent } from '../../../components/ng-medioPago-search/ng-medioPago-search.component';
import { NgFormaVentaSearchComponent } from '../../../components/ng-forma-venta-search/ng-forma-venta-search.component';
import { NgListaPrecioSearchComponent } from '../../../components/ng-lista-precio-search/ng-lista-precio-search.component';
import { FormsModule } from '@angular/forms';
import { ReportesService } from '../../../services/reportes.service';
import { Router } from '@angular/router';
import { MedioPago } from '../../../interfaces/facturas.interface';
import { ReportCobranza } from '../../../interfaces/reports.interface';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-reporteCobranza',
  standalone: true,
  imports: [CommonModule, FormsModule, InputDebounceComponent, PaginatorComponent, NgSucursalSearchComponent,
    NgMedioPagoSearchComponent, NgFormaVentaSearchComponent, NgListaPrecioSearchComponent],
  templateUrl: './reporteCobranza.component.html',
  styleUrl: './reporteCobranza.component.css'
})
export class ReporteCobranzaComponent {
  reporte = signal<ReportCobranza>({} as ReportCobranza);
  medioPago = signal<MedioPago >({}as MedioPago);
  sucursal = signal<Sucursal | null>(null);
  fechaDesde = moment(new Date()).format("YYYY-MM-DD");
  fechaHasta = moment(new Date()).format("YYYY-MM-DD");

  searchMedioPago = false;
  searchSucursal = false;
  searchListaPrecio = false;
  searchFormaVenta = false;

  detalles = computed(() => this.reporte().detalles ?? []);
  agrupados = computed(() => this.reporte().agrupado ?? []);
  cantidadMedios = computed(() => this.agrupados().reduce((cantidad, detalle) => cantidad + detalle.cantidadCobranza, 0) ?? 0);
  importeTotal = computed(() => this.agrupados().reduce((total, detalle) => total + detalle.importeTotal, 0) ?? 0);
  medioPagoId = computed(() => this.medioPago()?.id ?? 0);
  sucursalId = computed(() => this.sucursal()?.id ?? this._authService.currentUser()!.sucursalId);
  private _router = inject(Router)
  _reporteService = inject(ReportesService);
  _authService = inject(AuthService);
  constructor() {
    const storedSearchDatacobranza = localStorage.getItem('searchDataCobranza');

    if (storedSearchDatacobranza) {
      try {
        const parsedData = JSON.parse(storedSearchDatacobranza);
        this.medioPago.set(parsedData.medioPago);
        this.sucursal.set(parsedData.sucursal);
        this.fechaDesde = parsedData.fechaDesde;
        this.fechaHasta = parsedData.fechaHasta;
      } catch (error) {
        console.error('Error parsing stored search data:', error);
      }
    }
  }
  ngOnInit() {
    this.buscar();
  }
  buscar() {

    this.getPage( ); // Reset to first page on search
  }

  getPage( ) {
    if (!this.fechaDesde) {
      this.fechaDesde = moment(new Date()).format("YYYY-MM-DD");
    }
    if (!this.fechaHasta) {
      this.fechaHasta = moment(new Date()).format("YYYY-MM-DD");
    }


    localStorage.setItem('searchDataCobranza', JSON.stringify({
      medioPago: this.medioPago(),
      sucursal: this.sucursal(),
      fechaDesde: this.fechaDesde,
      fechaHasta: this.fechaHasta,
    }));

    this._reporteService
      .getReportCobranza(  this.fechaDesde, this.fechaHasta,  this.sucursalId(), this.medioPagoId())
      .subscribe({
        next: (resp) => {
          console.log(resp)
          this.reporte.set(resp);
          console.log(resp)
        },
        error: message => {
          console.error(message)
        }
      });




  }
  buscarMedioPago() { this.searchMedioPago = true; }

  buscarFormaVenta() { this.searchFormaVenta = true; }
  buscarSucursal() { this.searchSucursal = true }
  buscarListaPrecio() { this.searchListaPrecio = true }

  onPageChanged( ) {
    this.getPage( );
  }
  selectMedioPago(medioPago: MedioPago) {
    console.log("Selected client:", medioPago);
    this.medioPago.set(medioPago); // Update the client signal
    this.searchMedioPago = false; // Close the modal

  }

  selectSucursal(sucursal: Sucursal) {
    console.log("Selected sucursal:", sucursal);
    this.sucursal.set(sucursal); // Update the client signal
    this.searchSucursal = false; // Close the modal

  }


  verDetalles(ventaId: number) {
    this._router.navigate(['/ventas/detalles', ventaId]);

  }
  getDoc(id: number) {
    this._reporteService.getPdf(id).subscribe((response: any) => {
      const fileURL = URL.createObjectURL(response);
      window.open(fileURL, '_blank');

    })
  }



  cancelar() {

    try {


      this.medioPago.set({} as MedioPago);
      this.sucursal.set({} as Sucursal);

      this.fechaDesde = moment(new Date()).format("YYYY-MM-DD");
      this.fechaHasta = moment(new Date()).format("YYYY-MM-DD");
    } catch (error) {
      console.error('Error parsing stored search data:', error);
    }

  }



}
