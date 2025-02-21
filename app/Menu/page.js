"use client";
import anim from "../../public/Anim/abstract1.json";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import CryptoJS from "crypto-js";
import Cookies from "universal-cookie";
import Cerrar from "./CerrarTurno/Cerrar";
import VerArchivo from "./CerrarTurno/VerArchivo";
//import ArchivoCierreTurno from "./CerrarTurno/ArchivoCierreTurno";
export default function Menu() {
  const secretKey = "SECRET_KEY";
  const cookies = new Cookies();
  const param1 = cookies.get("param1") || "";
  const param1bytes = CryptoJS.AES.decrypt(param1, secretKey);
  const param2 = cookies.get("param2") || "";
  const param1bytes2 = CryptoJS.AES.decrypt(param2, secretKey);
  const param9 = cookies.get("param9") || "";
  const param1bytes9 = CryptoJS.AES.decrypt(param9, secretKey);
  const param4 = cookies.get("param4") || "";
  const param1bytes4 = CryptoJS.AES.decrypt(param4, secretKey);
  return (
    <>
      <div className="flex flex-row p-4 gap-2">
        <div className="bg-blue-100 dark:bg-black/40  w-full rounded-2xl p-10 items-center justify-center content-center">
          <h1 className="text-6xl font-semibold">Bienvenido</h1>
          <p className="text-2xl">
            {`${param1bytes.toString(
              CryptoJS.enc.Utf8
            )} ${param1bytes2.toString(CryptoJS.enc.Utf8)}`}{" "}
          </p>
          <p className="text-lg opacity-60">{`Sistema de turnos Hospital Muñoz`}</p>
        </div>
        <div className="bg-blue-200 dark:bg-black/20  w-full rounded-2xl p-4 overflow-hidden relative">
          <div className=" content-end self-end justify-end relative">
            <Lottie animationData={anim} className="h-[30vh] scale-150  " />
          </div>
        </div>
      </div>
      {param1bytes9.toString(CryptoJS.enc.Utf8) ===
        "SInC3rr@rTurnoUSu@ri0_$i$tem" &&
      param1bytes4.toString(CryptoJS.enc.Utf8) !== "Administrador" &&
      param1bytes4.toString(CryptoJS.enc.Utf8) !== "Enfermeria" ? (
        <Cerrar />
      ) : param1bytes4.toString(CryptoJS.enc.Utf8) !== "Administrador" &&
        param1bytes4.toString(CryptoJS.enc.Utf8) !== "Enfermeria" ? (
        <VerArchivo />
      ) : (
        ""
      )}
    </>
  );
}
