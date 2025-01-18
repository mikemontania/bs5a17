import { Sucursal } from "./sucursal.interface";
import { TablaSifen } from "./tablaSifen.interface";
export interface Numeracion {
  inicioTimbrado:  string;
  finTimbrado:     string;
  id:              number;
  itide:              number;
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
  tipoDocumento:        TablaSifen;
}
