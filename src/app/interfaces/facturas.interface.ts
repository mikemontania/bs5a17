export interface Venta {
  id: number;
  empresaId: number ;
  sucursalId: number ;
  listaPrecioId: number;
  formaVentaId: number;
  anulado: boolean;
  enviado: boolean;
  usuarioCreacionId: number ;
  usuarioAnulacionId: number ;
  fechaCreacion: Date;
  fechaModificacion: Date;
  fechaAnulacion: Date;
  fechaVenta: Date;
  fechaInicio: Date;
  timbrado: string;
  nroComprobante: string;
  porcDescuento: number;
  importeIva5: number ;
  importeIva10: number ;
  importeIvaExenta: number ;
  importeDescuento: number;
  importeNeto: number;
  importeSubtotal: number;
  importeTotal: number;
  clienteId: number;
  modoEntrega: string ;
  totalKg: number ;
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
