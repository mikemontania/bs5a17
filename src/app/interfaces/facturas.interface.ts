import { Cliente } from "./clientes.interface";
import { FormaVenta } from "./formaventa.interface";
import { VendedorCreacion } from "./pages.interfaces";
import { Sucursal } from "./sucursal.interface";

export interface Venta {
  fechaCreacion:      string;
  fechaModificacion:  string;
  fechaAnulacion:     string;
  fechaVenta:         string;
  fechaInicio:        string;
  fechaFin:           string;
  id:                 string;
  empresaId:          number;
  sucursalId:         number;
  listaPrecioId:      number;
  formaVentaId:       number;
  anulado:            boolean;
  enviado:            boolean;
  usuarioCreacionId:  number;
  usuarioAnulacionId: null;
  timbrado:           string;
  nroComprobante:     string;
  porcDescuento:      string;
  importeIva5:        string;
  importeIva10:       string;
  importeIvaExenta:   string;
  importeDescuento:   string;
  importeNeto:        string;
  importeSubtotal:    string;
  importeTotal:       string;
  clienteId:          string;
  modoEntrega:        string;
  totalKg:            string;
  vendedorCreacion:   VendedorCreacion;
  cliente:            Cliente;
  formaVenta:         FormaVenta;
  listaPrecio:        FormaVenta;
  sucursal:           Sucursal;
}
export interface VentaDetalle {
  id: number;
  ventaId: number ;
  varianteId: number ;
  cantidad: number;
  importePrecio: number;
  importeIva5: number ;
  importeIva10: number ;
  importeIvaExenta: number ;
  importeDescuento: number;
  importeNeto: number;
  importeSubtotal: number;
  importeTotal: number;
  totalKg: number ;
  tipo_descuento: string ;
}


export interface ModelCab {
  sucursalId: number  ;
  numeracionId: number  ;
  listaPrecioId: number;
  formaVentaId: number;
  porcDescuento: number;
  importeIva5: number ;
  importeIva10: number ;
  importeIvaExenta: number ;
  importeDescuento: number;
  importeNeto: number;
  importeSubtotal: number;
  importeTotal: number;
  clienteId: number;
 detalles: ModelDet[];
}

export interface ModelDet {
  varianteId: number ;
  descripcion:string;
  codErp:string;
  cantidad: number;
  porcDescuento: number;
  porcIva:number;
  importePrecio: number;
  importeIva5: number ;
  importeIva10: number ;
  importeIvaExenta: number ;
  importeDescuento: number;
  importeNeto: number;
  importeSubtotal: number;
  importeTotal: number;
  totalKg: number ;
  tipoDescuento: string ;
}
