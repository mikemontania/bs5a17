
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginatorComponent } from '../../../components/paginator/paginator.component';
import { SucursalService } from '../../../services/service.index';
import { Sucursal } from '../../../interfaces/sucursal.interface';

@Component({
  selector: 'app-sucursales',
  standalone: true,
  imports: [CommonModule, FormsModule,  PaginatorComponent,],
  templateUrl: './sucursales.component.html',
  styleUrl: './sucursales.component.css'
})
export class SucursalesComponent {
  sucursales = signal<Sucursal[]>([]);

  private _router = inject(Router)
  _sucursalesService = inject(SucursalService);
  constructor() {
    this.getPage();

  }
  ngOnInit() {
    this.buscar();
  }
  buscar() {

  }

  getPage() {

    this._sucursalesService
      .findAll().subscribe({
        next: (resp) => {
          this.sucursales.set(resp);
          console.log(resp)

        },
        error: message => {
          console.error(message)
        }
      });




  }


  verSucursal(sucursalId: number) {
    this._router.navigate(['/sucursales', 'sucursal', sucursalId]);

  }
  agregar() {
    this._router.navigate(['/sucursales/sucursal' ]);
  }




}
