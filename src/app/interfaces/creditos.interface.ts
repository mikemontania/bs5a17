import { Cliente } from "./clientes.interface";
import { CondicionPago } from "./condicionPago.interface";

export interface CreditoPaginado {
  total: number;
  pages: number;
  data: Credito[];
}

export interface Credito {
  id: string;
  empresaId: number;
  condicionPagoId: number;
  documentoId: number;
  anulado: boolean;
  usuarioCreacionId: string;
  timbrado: string;
  nroComprobante: string;
  cantDias: number;
  importeTotal: number;
  saldoPendiente: number;
  estado: "PENDIENTE" | "PAGADO" | null;
  fechaCreacion: string;
  fechaModificacion: string;
  fecha: string;
  fechaVencimiento: string;
  fechaPago: string | null;
  diasRestantes: number;
  diasMora: number;
  usuarioAnulacionId: string | null;
  clienteId: string;
  cliente: Cliente;
  condicionPago: CondicionPago;
}
