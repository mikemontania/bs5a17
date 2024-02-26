import { Sucursal } from "./sucursal.interface";

export interface Numeracion {
  inicioTimbrado:  string;
  finTimbrado:     string;
  id:              number;
  empresaId:       number;
  sucursalId:      number;
  numeroInicio:    number;
  numeroFin:       number;
  serie:           string;
  timbrado:        string;
  tipoComprobante: string;
  ultimoNumero:    number;
  tipoImpresion:   string;
  activo:          boolean;
  sucursal:        Sucursal;
}
