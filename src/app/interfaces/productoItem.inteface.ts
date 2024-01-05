// Generated by https://quicktype.io

export interface ProductoPage {
  total:         number;
  totalPages:    number;
  page:          number;
  pageSize:      number;
  productos: ProductosItem[];
}

export interface ProductosItem {
  id:           number;
  codBarra:     string;
  codErp:       string;
  img:          string;
  producto:     string;
  presentacion: string;
  variedad:     string;
  color:        string;
}
