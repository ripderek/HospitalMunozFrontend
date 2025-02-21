"use client";
import routes_admin from "../../Routes/Rutas-Admin";
import routes_secretario from "../../Routes/Rutas-Secretario";
import routes_enfermeria from "@/app/Routes/Rutas-Enfermeria";
import routes_residentes from "@/app/Routes/Rutas-Residentes";
import { HomeIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Cookies from "universal-cookie";
import CryptoJS from "crypto-js";
import Rutas from "./Rutas";
import { useState } from "react";
import Link from "next/link";
import UserCard from "./UserCard";

export default function MenuLateral() {
  const secretKey = "SECRET_KEY";
  const cookies = new Cookies();
  const param4 = cookies.get("param4") || "";
  const bytes = CryptoJS.AES.decrypt(param4, secretKey);
  const tipoRuta = bytes.toString(CryptoJS.enc.Utf8);

  /* PARA OBTENER LA CLAVE DEL TURNO */
  const param9 = cookies.get("param9") || "";
  const param1bytes9 = CryptoJS.AES.decrypt(param9, secretKey);

  const [openUser, SetOpenUser] = useState(false);
  const getRoutes = () => {
    switch (tipoRuta) {
      case "Administrador":
        return <Rutas rutas={routes_admin} />;
      case "Secretario":
        return <Rutas rutas={routes_secretario} />;
      case "Enfermeria":
        return <Rutas rutas={routes_enfermeria} />;
      case "Residentes":
        return <Rutas rutas={routes_residentes} />;
      default:
        return [];
    }
  };

  return (
    <aside className="w-auto bg-blue-100 h-full dark:bg-black/40 flex flex-col ">
      {openUser && (
        <UserCard abrir={openUser} cerrar={() => SetOpenUser(false)} />
      )}

      <div className=" p-2">
        <div className="p-2 flex flex-col text-center items-center mb-2">
          <button
            className={"rounded-full p-4  bg-white"}
            onClick={() => SetOpenUser(true)}
          >
            <UserCircleIcon className="h-7 w-7 text-blue-950" />
          </button>
        </div>
        <div className="p-2 flex flex-col text-center items-center mb-2">
          <Link href={"/Menu"}>
            <button
              className={"rounded-2xl p-4  bg-red-300 dark:bg-violet-900/30"}
            >
              <HomeIcon className="h-7 w-7 dark:hover:text-violet-300 dark:text-violet-500 text-red-500 hover:text-white" />
            </button>
          </Link>
        </div>
        {/* SI NO HA CERRADO TURNO MOSTRAR LAS RUTAS */}
        {param1bytes9.toString(CryptoJS.enc.Utf8) ===
        "SInC3rr@rTurnoUSu@ri0_$i$tem"
          ? getRoutes()
          : ""}
      </div>
      {/*
      <div className="p-2">
        <button className="text-black w-full dark:text-white rounded-2xl p-4 bg-red-300 dark:bg-red-900 hover:bg-red-400 dark:hover:bg-red-700  flex justify-center items-center">
          <span>Salir</span>
        </button>
      </div> */}
    </aside>
  );
}
