"use client";
import { usePathname } from "next/navigation";

import Link from "next/link";
export default function MenuLateral({ rutas }) {
  const currentPath = usePathname(); // Obtiene la URL actual

  return (
    <>
      {rutas.map(({ layout, title, pages }, key) => (
        <ul key={key} className=" flex flex-col gap-2  text-center">
          {pages.map(({ icon, name, path }) => (
            <li key={name} className="text-center items-center">
              <Link href={path}>
                <button
                  className={` rounded-2xl p-2 hover:bg-blue-300 dark:hover:bg-slate-900 ${
                    currentPath === path
                      ? "bg-blue-200 dark:bg-slate-800"
                      : "bg-transparent"
                  }`}
                >
                  {icon("h-7 w-7")}
                </button>
                <p className="font-medium capitalize text-xs ">{name}</p>
              </Link>
            </li>
          ))}
        </ul>
      ))}
    </>
  );
}
