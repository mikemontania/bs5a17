import { Cliente } from './clientes.interface';
import { Venta } from './facturas.interface';
import { Numeracion } from './numeracion.interface';
import { Usuario } from './usuario.interface';


export interface VentasPage {
  total:      number;
  totalPages: number;
  page:       number;
  pageSize:   number;
  ventas:     Venta[];
}


export interface NumeracionesPage {
  total:        number;
  totalPages:   number;
  page:         number;
  pageSize:     number;
  numeraciones: Numeracion[];
}

export interface ClientesPage {
  total:      number;
  totalPages: number;
  page:       number;
  pageSize:   number;
  clientes:     Cliente[];
}


export interface UsuariosPage {
  total:      number;
  totalPages: number;
  page:       number;
  pageSize:   number;
  usuarios:     Usuario[];
}


export interface VendedorCreacion {
  usuario: string;
}
