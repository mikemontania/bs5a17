import { INavbarData } from "./helper";

export const navbarData: INavbarData[] = [
  {
    routeLink: 'dashboard',
    icon: 'fa-solid fa-house',
    label: 'Dashboard',
    rol:['vendedor','admin']
  },


  {
    routeLink: 'ventas',
    icon: 'fa-solid fa-cash-register',
    label: 'Facutacion',
    rol:['vendedor','admin'],
    items: [
      {
        routeLink: 'ventas',
        rol:['vendedor','admin'],

        label: 'Ventas'
      },
      {
        routeLink: 'ventas/listar',
        rol:['vendedor','admin'],

        label: 'Listado'
      },
      {
        routeLink: 'ventas/reporteCobranza',
        rol:[ 'admin'],
        label: 'Reporte Cobranza'
      },

    ]

  },
  {
    routeLink: 'valoraciones',
    icon: 'bi bi-tags',
    label: 'Valoraciones',
    rol:[ 'admin'],

    items: [
      {
        routeLink: `valoraciones/PRECIO/IMPORTE`,
        rol:['vendedor','admin'],
        label: 'Precios'
      },
      {
        routeLink: `valoraciones/DESCUENTO/PRODUCTO`,
        rol:['vendedor','admin'],
        label: 'Descuento/Prd'
      },
      {
        routeLink: `valoraciones/DESCUENTO/IMPORTE`,
        rol:['vendedor','admin'],
        label: 'Descuento/Gs'
      },
    /*   {
        routeLink: `valoraciones/PUNTO/PRODUCTO`,
        rol:['vendedor','admin'],
        label: 'Puntos'
      } */
    ]
  },
  {
    routeLink: 'productos',
    icon: 'bi bi-bag-check',
    rol:[ 'admin'],
    label: 'Productos'
  },

  {
    routeLink: 'clientes',
    icon: 'fa-solid fa-user',
    rol:['vendedor','admin'],
    label: 'Clientes'
  },

  {
    routeLink: 'numeraciones',
    icon: 'fa-solid fa-arrow-down-1-9',
    rol:[ 'admin'],
    label: 'Numeraciones'
  },

  {
    routeLink: 'usuarios',
    icon: 'fa-solid fa-user-tag',
    rol:['vendedor','admin'],
    label: 'usuarios'
  },
  {
    routeLink: 'empresa',
    icon: 'fa-solid fa-building',
    label: 'Empresa',
    rol:[ 'admin']
  },
  /*  {
    routeLink: 'parametros',
    icon: 'fa-solid fa-tag',
    label: 'Parametros',
    items: [
      {
        routeLink: 'parametros/empleados',
        label: 'Empleados'
      },
      {
        routeLink: 'parametros/sectores',
        label: 'Sectores'
      },
      {
        routeLink: 'parametros/conceptos',
        label: 'Conceptos'
      }
    ]
  },
  {
    routeLink: 'pages',
    icon: 'fa-regular fa-file',
    label: 'Pages'
  },
  {
    routeLink: 'settings',
    icon: 'fa-solid fa-gear',
    label: 'Settings',

  }, */
];
