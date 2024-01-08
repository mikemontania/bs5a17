
export interface Numeracion {
  id:              number;
  empresaId:       number;
  sucursalId:      number;
  inicioTimbrado:  string;
  finTimbrado:     string;
  numeroInicio:    number;
  numeroFin:       number;
  serie:           string;
  timbrado:        string;
  tipoTomprobante: string;
  ultimoNumero:    number;
  tipoImpresion:   string;
  activo:          boolean;
}
