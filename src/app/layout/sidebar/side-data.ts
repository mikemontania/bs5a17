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
      label: 'Ventas'
  },
    {
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

    },
];
