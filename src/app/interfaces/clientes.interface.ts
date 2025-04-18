// Generated by https://quicktype.io

import { CondicionPago } from "./condicionPago.interface";
import { ListaPrecio } from "./listaPrecio.interface";

export interface Cliente {
  id:                number;
  empresaId:         number;
  listaPrecioId:     number;
  condicionPagoId:     number;
  usuarioCreacionId: number;
  fechaModif:        string;
  usuarioModif:      number;
  fechaCreacion:     string;
  razonSocial:       string;
  nroDocumento:      string;
  direccion:         string;
  telefono:          string;
  cel:          string;
  email:             string;
  excentoIva:        boolean;
  latitud:           string;
  longitud:          string;
  predeterminado:    boolean;
  empleado:          number;
  propietario:       boolean;
  activo:            boolean;
  listaPrecio?:     ListaPrecio;
  condicionPago?:     CondicionPago;
}
