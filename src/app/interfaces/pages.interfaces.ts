import { Cliente } from './clientes.interface';
import { Venta } from './facturas.interface';


export interface VentasPage {
  total:      number;
  totalPages: number;
  page:       number;
  pageSize:   number;
  ventas:     Venta[];
}



export interface ClientesPage {
  total:      number;
  totalPages: number;
  page:       number;
  pageSize:   number;
  clientes:     Cliente[];
}

export interface VendedorCreacion {
  usuario: string;
}
