

export interface User {
   codUsuario: number,
   codEmpresa: number,
   codSucursal: number,
   codEmpresaErp: string,
   codSucursalErp: string,
   nombre: string,
   username: string,
   password: string,
   authorities?: Authorities,
   img?: string,
   maxDescuentoImp?: number,
   maxDescuentoPorc?: number,
   cantItem?: number
}
export interface Authorities {

            id: number,
            nombreRol: string,


  }
