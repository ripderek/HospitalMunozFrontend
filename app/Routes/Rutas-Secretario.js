//Este es un nuevo archivo que no se habia usado en el proyecto anterior sirve como un rotueador parecedio a nodejs

import {
  CalendarIcon,
  QueueListIcon,
  BanknotesIcon,
  ShoppingCartIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";

export const routes_secretario = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: (className) => <CalendarIcon className={className} />,
        name: "Turnos",
        path: "/Menu/Turnos",
      },
      {
        icon: (className) => <QueueListIcon className={className} />,
        name: "Procedimientos",
        path: "/Menu/Procedimientos",
      },
      {
        icon: (className) => <BanknotesIcon className={className} />,
        name: "Egresos",
        path: "/Menu/Egresos",
      },
      {
        icon: (className) => <ShoppingCartIcon className={className} />,
        name: "Ventas",
        path: "/Menu/Ventas",
      },
      {
        icon: (className) => <BuildingLibraryIcon className={className} />,
        name: "Honorarios",
        path: "/Menu/Honorarios",
      },
    ],
  },
];

export default routes_secretario;
