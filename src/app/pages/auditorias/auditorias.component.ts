import { CommonModule } from "@angular/common";
import { Component, signal, computed, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import moment from "moment";
import Swal from "sweetalert2";
import { AuthService } from "../../auth/services/auth.service";
import { InputDebounceComponent } from "../../components/inputDebounce/inputDebounce.component";
import { PaginatorComponent } from "../../components/paginator/paginator.component";
import { Auditado, AuditoriaPage  } from "../../interfaces/pages.interfaces";
import { AuditoriaService } from '../../services/auditoria.service';

@Component({
  selector: 'app-auditorias',
  standalone: true,
  imports: [CommonModule, FormsModule, InputDebounceComponent, PaginatorComponent     ],
  templateUrl: './auditorias.component.html',
  styleUrl: './auditorias.component.css'
})
export class AuditoriasComponent {
  searchTerm = signal<string>('');
  auditoriasPage = signal<AuditoriaPage>({} as AuditoriaPage);
  page = signal<number>(1);
  totalPages = signal<number>(1);
  pageSize = signal<number>(15);
  fechaDesde = moment(new Date()).format("YYYY-MM-DD");
  fechaHasta = moment(new Date()).format("YYYY-MM-DD");
  auditados = computed(() => this.auditoriasPage().auditados ?? []);

  private _router = inject(Router)
  _auditoriasService = inject(AuditoriaService);

  _authService = inject(AuthService)
  constructor() {
    const storedSearchData = localStorage.getItem('searchAudit');

    if (storedSearchData) {
      try {
        const parsedData = JSON.parse(storedSearchData);
        this.searchTerm.set(parsedData.searchTerm);

        this.page.set(parsedData.page);
        this.pageSize.set(parsedData.pageSize);
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

    this.getPage(this.page()); // Reset to first page on search
  }
  debounceSearch(event: any) {
    this.searchTerm.set(event);
    this.getPage(1); // Reset to first page on search
  }
  getPage(page: number) {
    if (!this.fechaDesde) {
      this.fechaDesde = moment(new Date()).format("YYYY-MM-DD");
    }
    if (!this.fechaHasta) {
      this.fechaHasta = moment(new Date()).format("YYYY-MM-DD");
    }
    this.page.set(page);

    localStorage.setItem('searchAudit', JSON.stringify({
      searchTerm: this.searchTerm(),

      page: this.page(),
      pageSize: this.pageSize(),
      fechaDesde: this.fechaDesde,
      fechaHasta: this.fechaHasta,
    }));

    this._auditoriasService
      .search(this.page(), this.pageSize(), this.fechaDesde, this.fechaHasta,  this.searchTerm())
      .subscribe({
        next: (resp) => {
          this.auditoriasPage.set(resp);
          console.log(resp)
          this.page.set(resp.page);
          this.totalPages.set(resp.totalPages);
        },
        error: message => {
          console.error(message)
        }
      });

  }


  onPageChanged(newPage: number) {
    this.getPage(newPage);
  }


  delete(id: number) {
    Swal.fire({
      title: 'Está segur@ que desea anular la factura?',
      text: `La factura serà anulada`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Anular',
      cancelButtonText: 'No, No anular ',
      customClass: {
        confirmButton: 'btn btn-success',  // Clase personalizada para el botón de confirmación
        cancelButton: 'btn btn-danger'    // Clase personalizada para el botón de cancelación
      },
      buttonsStyling: false,
      reverseButtons: true
    }).then(async (result) => {
      if (result.value) {
        this._auditoriasService.eliminar(id).subscribe((response: any) => {
          this.buscar()
          Swal.fire('Factura anulada!!!', 'factura anulada con exito!!! comprobante:', 'success');

        })
      }
    });


  }


  mostrarModal(titulo: string, audit: Auditado) {
    const jsonFormatted = JSON.stringify((titulo === 'Valor Anterior') ? audit.oldValue : audit.newValue, null, 2);
    Swal.fire({
      title: titulo,
      html: `<pre style="text-align: left;">${jsonFormatted}</pre>`, // Alineamos el texto a la izquierda
      icon: 'info',
      confirmButtonText: 'Cerrar'
    });
  }

  cancelar() {

    try {

      this.searchTerm.set('');
      this.page.set(1);
      this.pageSize.set(10);
      this.fechaDesde = moment(new Date()).format("YYYY-MM-DD");
      this.fechaHasta = moment(new Date()).format("YYYY-MM-DD");
    } catch (error) {
      console.error('Error parsing stored search data:', error);
    }

  }



}
