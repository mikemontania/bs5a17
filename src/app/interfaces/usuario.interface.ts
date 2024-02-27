import { Numeracion } from "./numeracion.interface";
import { Sucursal } from "./sucursal.interface";

export interface Usuario {
  id: number;
  sucursalId: number;
  numPrefId: number;
  username: string;
  password: string;
  usuario: string;
  img: string;
  rol: string;
  activo: boolean;
  bloqueado: boolean;
  numeracion:Numeracion;
  sucursal:Sucursal;
}
