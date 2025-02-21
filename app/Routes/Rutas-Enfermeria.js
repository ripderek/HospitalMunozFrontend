//Este es un nuevo archivo que no se habia usado en el proyecto anterior sirve como un rotueador parecedio a nodejs

import { CalendarIcon } from "@heroicons/react/24/outline";

export const routes_enfermeria = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: (className) => <CalendarIcon className={className} />,
        name: "Hospitalizacion",
        path: "/Menu/Hospitalizacion",
      },
    ],
  },
];

export default routes_enfermeria;
