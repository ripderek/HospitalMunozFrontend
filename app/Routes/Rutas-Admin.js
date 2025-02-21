//Este es un nuevo archivo que no se habia usado en el proyecto anterior sirve como un rotueador parecedio a nodejs

import {
  CalendarIcon,
  QueueListIcon,
  BanknotesIcon,
  BeakerIcon,
  BuildingLibraryIcon,
  UserGroupIcon,
  UsersIcon,
  ShoppingCartIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";

export const routes_admin = [
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
      {
        icon: (className) => <QueueListIcon className={className} />,
        name: "Procedimientos",
        path: "/Menu/Procedimientos",
      },
      {
        icon: (className) => <BuildingStorefrontIcon className={className} />,
        name: "Departamentos",
        path: "/Menu/Departamentos",
      },
      {
        icon: (className) => <BanknotesIcon className={className} />,
        name: "Egresos",
        path: "/Menu/Egresos",
      },
      {
        icon: (className) => <BeakerIcon className={className} />,
        name: "Medicinas",
        path: "/Menu/Medicinas",
      },
      {
        icon: (className) => <BuildingLibraryIcon className={className} />,
        name: "Honorarios",
        path: "/Menu/Honorarios",
      },
      {
        icon: (className) => <UserGroupIcon className={className} />,
        name: "Personal",
        path: "/Menu/Personal",
      },
      {
        icon: (className) => <CalendarIcon className={className} />,
        name: "Hospitalizacion",
        path: "/Menu/Hospitalizacion",
      },
    ],
  },
];

/*
{
        icon: (className) => <UsersIcon className={className} />,
        name: "Pacientes",
        path: "/Menu/Pacientes",
      },
*/
export default routes_admin;
