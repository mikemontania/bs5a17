import { Venta } from './facturas.interface';


export interface VentasPage {
  total:      number;
  totalPages: number;
  page:       number;
  pageSize:   number;
  ventas:     Venta[];
}




export interface VendedorCreacion {
  usuario: string;
}
