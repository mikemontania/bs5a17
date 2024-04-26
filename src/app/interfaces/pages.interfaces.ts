import { Cliente } from './clientes.interface';
import { Venta } from './facturas.interface';
import { Numeracion } from './numeracion.interface';
import { Sucursal } from './sucursal.interface';
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
export interface AuditoriaPage {
  total:      number;
  totalPages: number;
  page:       number;
  pageSize:   number;
  auditados:  Auditado[];
}

export interface Auditado {
  fecha:             string;
  fechaModificacion: string;
  id:                number;
  empresaId:         number;
  sucursalId:        number;
  usuarioId:         number;
  metodo:            string;
  path:              string;
  oldValue:          JSON;
  newValue:          JSON;
  status:            string;
  mensaje:           string;
  ipCliente:         string;
  usuario:           Usuario;
  sucursalUsuario:   Sucursal;
}
