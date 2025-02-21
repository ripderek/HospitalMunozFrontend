//Este es un nuevo archivo que no se habia usado en el proyecto anterior sirve como un rotueador parecedio a nodejs

import { CalendarIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";

export const routes_residentes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: (className) => <CalendarIcon className={className} />,
        name: "Turnos",
        path: "/Menu/Turnos",
      },
      {
        icon: (className) => <ShoppingCartIcon className={className} />,
        name: "Ventas",
        path: "/Menu/Ventas",
      },
    ],
  },
];

export default routes_residentes;
