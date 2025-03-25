 import { Cliente } from "./clientes.interface";
import { CondicionPago } from "./condicionPago.interface";
import { VendedorCreacion } from "./pages.interfaces";
import { Sucursal } from "./sucursal.interface";

export interface Documento {
  tipoDoc: string;
  idMotEmi:number;
  fechaCreacion:      string;
  fechaModificacion:  string;
  fechaAnulacion:     string;
  fecha:         string;
  fechaInicio:        string;
  fechaFin:           string;
  id:                 number;
  empresaId:          number;
  sucursalId:         number;
  listaPrecioId:      number;
  cdc:                string;
  cdcAsociado:        string;
  docAsociadoId:       number;
  condicionPagoId:       number;
  anulado:            boolean;
  enviado:            boolean;
  usuarioCreacionId:  number;
  usuarioAnulacionId: null;
  timbrado:           string;
  nroComprobante:     string;
  porcDescuento:      string;
  importeIva5:        number;
  importeIva10:       number;
  importeIvaExenta:   number;
  valorNeto:   number;
  importeDescuento:   number;
  importeNeto:        number;
  importeDevuelto:   number;
  tipoDocumento:TipoDocumento;
  importeSubtotal:    number;
  importeTotal:       number;
  clienteId:          string;
  modoEntrega:        string;
  totalKg:            number;
  estado:        string;
  vendedorCreacion:   VendedorCreacion;
  vendedorAnulacion: VendedorCreacion;
  cliente:            Cliente;
  condicionPago:         CondicionPago;
  listaPrecio:        CondicionPago;
  sucursal:           Sucursal;
}
export interface DocumentoDetalle {
  id:               number;
  documentoId:          number;
  varianteId:       number;
  cantidad:         number;
  importePrecio:    number;
  importeIva5:      number;
  importeIva10:     number;
  importeIvaExenta: number;
  importeDescuento: number;
  importeNeto:      number;
  importeSubtotal:  number;
  importeTotal:     number;
  porcDescuento: number;
  totalKg:          number;
  tipoDescuento:    string;
  variante:         Variante;
}


export interface Variedad {
  id:          string;
  descripcion: string;
  color:       string;
}
export interface TipoDocumento {
  id:          string;
  codigo:  string;
  descripcion: string;
}

export interface Variante {
  id:             number;
  codBarra:       string;
  concat:string;
  codErp:         string;
  porcIva:        string;
  empresaId:      number;
  presentacionId: number;
  variedadId:     number;
  img:            string;
  productoId:     number;
  unidadId:       number;
  activo:         boolean;
  presentacion:   Presentacion;
  variedad:       Variedad;
  producto:       Producto;
  unidad:         Unidad;
}
export interface Unidad {
  id:             number;
  code: string;
  descripcion: string;
}

export interface Presentacion {
  id:          string;
  descripcion: string;
  size:        string;
}

export interface Producto {
  id:             number;
  nombre: string;
  descripcion: string;
}

export interface ModelCab {
  sucursalId: number  ;
  numeracionId: number  ;
  listaPrecioId: number;
  condicionPagoId: number;
  porcDescuento: number;
  importeIva5: number ;
  importeIva10: number ;
  importeIvaExenta: number ;
  importeDescuento: number;
  importeNeto: number;
  importeSubtotal: number;
  importeTotal: number;
  clienteId: number;
  cobranza?:Cobranza;
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
  ivaTipo: number;
  ivaBase:number
}

export interface Cobranza {
  id: number;
  empresaId: number;
  sucursalId: number;
  usuarioCreacionId: number;
  fechaCobranza: string;
  importeAbonado: number;
  importeCobrado: number;
  saldo: number;
  anulado: boolean;
  usuarioAnulacionId: number | null;
  fechaAnulacion: string | null;
  tipo: string | null;
  detalle:CobranzaDetalle[];
  Empresa?: Empresa; // Relación con la entidad Empresa
  //Usuario?: Usuario; // Relación con la entidad Usuario
  Sucursal?: Sucursal; // Relación con la entidad Sucursal
}
export interface CobranzaDetalle {
  id: number;
  fechaEmision: string | null;
  fechaVencimiento: string | null;
  importeAbonado: number;
  importeCobrado: number;
  nroCuenta: string | null;
  nroRef: string | null;
  saldo: number;
  bancoId: number | null;
  cobranzaId: number;
  medioPagoId: number;
  Banco?: Banco; // Relación con la entidad Banco
  Cobranza?: Cobranza; // Relación con la entidad Cobranza
  MedioPago?: MedioPago; // Relación con la entidad MedioPago
}
export interface MedioPago {
  id: number;
  empresaId: number;
  descripcion: string  ;
  esCheque: boolean;
  tieneBanco: boolean;
  tieneRef: boolean;
  tieneTipo: boolean;
  esObsequio: boolean  ;
  usuarioCreacionId: number | null;
  usuarioModificacionId: number | null;
  fechaCreacion: string;
  fechaModificacion: string;
  Empresa?: Empresa; // Relación con la entidad Empresa
 // UsuarioCreacion?: Usuario; // Relación con la entidad Usuario (creación)
  //UsuarioModificacion?: Usuario; // Relación con la entidad Usuario (modificación)
}
export interface Banco {
  id: number;
  empresaId: number | null;
  descripcion: string;
  activo: boolean;
  Empresa?: Empresa; // Relación con la entidad Empresa
}
export interface Empresa {
  id: number;
  razonSocial: string | null;
  actividad1: string | null;
  actividad2: string | null;
  actividad3: string | null;
  ruc: string | null;
  telefono: string | null;
  email: string | null;
  img: string | null;
  web: string | null;
}
