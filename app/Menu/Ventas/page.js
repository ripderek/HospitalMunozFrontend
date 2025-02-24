"use client";
import anim from "../../../public/Anim/abstract1.json";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import CrearVenta from "./CrearVenta";
import ListaVentas from "./ListaVentas";
import { useState } from "react";
import FacturaVisor from "./FacturaVisor";

export default function Ventas() {
  const [reload, setReload] = useState(false);
  // Función para forzar la actualización de ListarTurnos
  const actualizarLista = () => {
    setReload((prev) => !prev);
  };
  const [IDVentaVer, SetIdVentaVer] = useState(0);
  const ObtenerIDVenta = (id) => {
    SetIdVentaVer(id);
  };
  return (
    <>
      <div className="flex flex-row p-4 gap-2">
        <div className="bg-blue-100 dark:bg-black/40  w-full rounded-2xl p-10 items-center justify-center content-center">
          <h1 className="text-5xl font-semibold">Ventas</h1>
          <p className="text-xl">Aqui puedes gestionar las ventas</p>
          <div className="mt-2 gap-2 flex">
            <a
              className=" p-4 rounded-3xl bg-blue-900 text-xl text-white "
              href="#form"
            >
              Registrar
            </a>
            <a
              className=" p-4 rounded-3xl bg-blue-950 text-xl text-white "
              href="#lista"
            >
              Ventas del día
            </a>
          </div>
        </div>
        <div className="bg-blue-200 dark:bg-black/20  w-full rounded-2xl p-4 overflow-hidden relative">
          <div className=" content-end self-end justify-end relative">
            <Lottie animationData={anim} className="h-[30vh] scale-150  " />
          </div>
        </div>
      </div>
      {/* COMPONENTE CREAR TURNO  */}
      {IDVentaVer !== 0 && (
        <FacturaVisor ventaid={IDVentaVer} cerrar={() => ObtenerIDVenta(0)} />
      )}
      <CrearVenta
        actualizarLista={actualizarLista}
        ObtenerIDVenta={ObtenerIDVenta}
      />
      <ListaVentas reload={reload} ObtenerIDVenta={ObtenerIDVenta} />
    </>
  );
}
