import { INavbarData } from "./helper";

export const navbarData: INavbarData[] = [
  {
    routeLink: 'dashboard',
    icon: 'fa-solid fa-house',
    label: 'Dashboard'
  },


  {
    routeLink: 'ventas',
    icon: 'fa-solid fa-cash-register',
    label: 'Facutacion',
    items: [
      {
        routeLink: 'ventas',
        label: 'Ventas'
      },
      {
        routeLink: 'ventas/listar',
        label: 'Listado'
      },
      {
        routeLink: 'ventas/reporteCobranza',
        label: 'Reporte Cobranza'
      },

    ]

  },
  {
    routeLink: 'valoraciones',
    icon: 'bi bi-tags',
    label: 'Valoraciones',
    items: [
      {
        routeLink: `valoraciones/PRECIO/IMPORTE`,
        label: 'Precios'
      },
      {
        routeLink: `valoraciones/DESCUENTO/PRODUCTO`,
        label: 'Descuento/Prd'
      },
      {
        routeLink: `valoraciones/DESCUENTO/IMPORTE`,
        label: 'Descuento/Gs'
      },
      {
        routeLink: `valoraciones/PUNTO/PRODUCTO`,
        label: 'Puntos'
      }
    ]
  },
  {
    routeLink: 'productos',
    icon: 'bi bi-bag-check',
    label: 'Productos'
  },

  {
    routeLink: 'clientes',
    icon: 'fa-solid fa-user',
    label: 'Clientes'
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
