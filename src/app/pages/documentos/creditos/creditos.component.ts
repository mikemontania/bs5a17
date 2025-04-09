import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputDebounceComponent } from '../../../components/inputDebounce/inputDebounce.component';
import { PaginatorComponent } from '../../../components/paginator/paginator.component';
import moment from 'moment';

import { NgCondicionPagoSearchComponent } from '../../../components/ng-condicion-pago-search/ng-condicion-pago-search.component';
import { NgListaPrecioSearchComponent } from '../../../components/ng-lista-precio-search/ng-lista-precio-search.component';
import { FormsModule } from '@angular/forms';
import { CreditosService } from '../../../services/service.index';
import { Cliente } from '../../../interfaces/clientes.interface';
import { NgClienteSearchComponent } from '../../../components/ng-cliente-search/ng-cliente-search.component';
import { AuthService } from '../../../auth/services/auth.service';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
 import { NgEstadoCreditoSearchComponent } from '../../../components/ng-estado-search/ng-estado-search.component';
import { CreditoPaginado } from '../../../interfaces/creditos.interface';
import { ResumenCreditoComponent } from '../../../components/app-resumen-credito/app-resumen-credito.component';
import { HistorialCreditoComponent } from '../../../components/app-historial-credito/app-historial-credito.component';


@Component({
  selector: 'app-creditos',
  standalone: true,
  imports: [CommonModule, FormsModule,
    NgEstadoCreditoSearchComponent,
    NgClienteSearchComponent,HistorialCreditoComponent,
    InputDebounceComponent, PaginatorComponent,ResumenCreditoComponent,
    NgCondicionPagoSearchComponent,
    NgListaPrecioSearchComponent],
  templateUrl: './creditos.component.html',
  styleUrl: './creditos.component.css'
})
export class CreditoComponent {
  searchComprobante = signal<string>('');
  fechaDesde = moment().format('YYYY-MM-DD');
  fechaHasta = moment().format('YYYY-MM-DD');
  page = signal<number>(1);
  totalPages = signal<number>(1);
  pageSize = signal<number>(10);
  cliente = signal<Cliente | null>(null);
  searchCliente = false;
  searchEstado = false;
  searchHistorial = false;
  creditoHistorialId:any = null;
  creditos: any[] = [];
  resumenCredito = {
    totalMonto: 0,
    totalVencidos: 0,
    totalPagados: 0,
    totalPendientesACobrar: 0,
    totalCreditos: 0,
    cantidadPagados: 0,
    cantidadPendientes: 0,
    cantidadVencidos: 0
  };
  cargando: boolean = false;

  resumenCreditoFecha = {
    totalMonto: 0,
    totalVencidos: 0,
    totalPagados: 0,
    totalPendientesACobrar: 0,
    totalCreditos: 0,
    cantidadPagados: 0,
    cantidadPendientes: 0,
    cantidadVencidos: 0
  };

  estado: any = { id: 'TODOS', descripcion: 'TODOS' }; // Inicializa correctamente el estado con "TODOS"

   _creditoService = inject(CreditosService);
  _authService = inject(AuthService)
  constructor() {
    const stored = localStorage.getItem('searchCreditos');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this.fechaDesde = parsed.fechaDesde;
        this.fechaHasta = parsed.fechaHasta;
      } catch (e) {
        console.error('Error cargando búsqueda guardada:', e);
      }
    }
  }

  ngOnInit(): void {
    const stored = localStorage.getItem('searchCreditos');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this.fechaDesde = parsed.fechaDesde;
        this.fechaHasta = parsed.fechaHasta;
        this.buscar(); // mover aquí
      } catch (e) {
        console.error('Error cargando búsqueda guardada:', e);
      }
    }
  }
  debounceSearch(event: any) {
    this.searchComprobante.set(event);
    this.getPage(1); // Reset to first page on search
  }
  buscar(): void {
    this.obtenerResumen();
    localStorage.setItem('searchCreditos', JSON.stringify({
      fechaDesde: this.fechaDesde,
      fechaHasta: this.fechaHasta,
    }));

    // Solo llamar a getPage(1) si la página actual no es 1
    if (this.page() !== 1) {
      this.page.set(1); // Establecer a la primera página
      this.getPage(1);
    } else {
      this.getPage(this.page());
    }
  }
  selectCliente(cliente: Cliente) {
    console.log("Selected client:", cliente);
    this.cliente.set(cliente); // Update the client signal
    this.searchCliente = false; // Close the modal
  }

  selectEstado(estado: any) {
    console.log("Selected estado:", estado);
    this.estado = estado; // Update the client signal
    this.searchEstado = false; // Close the modal
  }
  onPageChanged(newPage: number) {
    this.getPage(newPage);
  }


  buscarCliente() { this.searchCliente = true; }
  buscarEstado() { this.searchEstado = true; }
  getPage(page: number) {
    if (!this.fechaDesde) {
      this.fechaDesde = moment(new Date()).format("YYYY-MM-DD");
    }
    if (!this.fechaHasta) {
      this.fechaHasta = moment(new Date()).format("YYYY-MM-DD");
    }
    this.page.set(page);

    localStorage.setItem('searchCreditoList', JSON.stringify({
      searchComprobante: this.searchComprobante(),
      estado: this.estado,
      cliente: this.cliente(),
      page: this.page(),
      pageSize: this.pageSize(),
      fechaDesde: this.fechaDesde,
      fechaHasta: this.fechaHasta,
    }));

    this._creditoService.getPaginado(
      this.page(),
      this.pageSize(),
      this.fechaDesde,
      this.fechaHasta,
      this.cliente()?.id || null,
      this.searchComprobante() || null,
      this.estado.id || null
    ).subscribe({
      next: (resp: CreditoPaginado) => {
        this.creditos = resp.data;
        this.totalPages.set(resp.pages); // importante para el paginator
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando créditos:', err);
      }
    });

  }
  cancelar(): void {
    this.fechaDesde = moment().format('YYYY-MM-DD');
    this.fechaHasta = moment().format('YYYY-MM-DD');
    this.buscar();
  }
  formatNumberWithThousandsSeparator(value: number): string {
    // Primero, convertimos el valor a un número entero, y luego lo formateamos
    const number = Math.round(value); // Redondeamos el número si es necesario
    return number.toLocaleString('es-PY'); // Usamos el formato de Paraguay para separar miles con puntos
  }
  pagarCredito(credito: any) {
    Swal.fire({
      title: '¿Confirmar pago?',
      text: `Está a punto de registrar el pago de Gs. ${this.formatNumberWithThousandsSeparator(credito.saldoPendiente)}.`, // Ahora con separadores de miles
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Pagar',
      cancelButtonText: 'No, No pagar',
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false,
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this._creditoService.pagar(credito.id).subscribe(() => {
          this.buscar();
          Swal.fire('¡Pago registrado!', 'El pago ha sido realizado con éxito.', 'success');
        });
      }
    });
  }


  getHistorial(id: number) {
       this.creditoHistorialId =id;
this.searchHistorial= true;
  }
  obtenerResumen(): void {
    const resumenNormal$ = this._creditoService.getWidget(this.fechaDesde, this.fechaHasta);
    const resumenGlobal$ = this._creditoService.getWidget('2000-01-01', '9999-12-31');
    forkJoin([resumenNormal$, resumenGlobal$]).subscribe(([resumenNormal, resumenGlobal]) => {
      if (resumenNormal) {
        this.resumenCredito = resumenNormal;
      }
      if (resumenGlobal) {
        this.resumenCreditoFecha = resumenGlobal;
      }
    });
  }




}
