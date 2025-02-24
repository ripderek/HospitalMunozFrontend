import CryptoJS from "crypto-js";
import Cookies from "universal-cookie";
import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function UserCard({ cerrar, abrir }) {
  const secretKey = "SECRET_KEY";
  const cookies = new Cookies();
  const param1 = cookies.get("param1") || "";
  const param1bytes = CryptoJS.AES.decrypt(param1, secretKey);
  const param2 = cookies.get("param2") || "";
  const param2bytes = CryptoJS.AES.decrypt(param2, secretKey);
  const param4 = cookies.get("param4") || "";
  const param4bytes = CryptoJS.AES.decrypt(param4, secretKey);
  //const tipoRuta = bytes.toString(CryptoJS.enc.Utf8);
  return (
    <div
      className={`w-96 fixed top-2 left-24 z-40  h-auto p-5 rounded-2xl shadow-xl bg-slate-50 dark:bg-slate-900 dark:shadow-slate-600 dark:shadow-lg
    transition-transform duration-500 ease-in-out transform ${
      abrir
        ? "translate-x-0  opacity-100"
        : "translate-x-52 opacity-0 pointer-events-none"
    }`}
    >
      <div className="flex flex-row">
        <h1 className="text-lg flex-1">Datos Usuario</h1>
        <button
          className="p-2 text-sm bg-blue-600 rounded-full font-semibold text-white self-end"
          onClick={cerrar}
        >
          X
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-2xl">
          {param1bytes.toString(CryptoJS.enc.Utf8)}
        </h1>
        <h1 className="font-bold text-2xl">
          {param2bytes.toString(CryptoJS.enc.Utf8)}
        </h1>
        <h1 className="font-normal text-lg p-2 bg-blue-100 dark:bg-slate-950 w-max rounded-2xl">
          {param4bytes.toString(CryptoJS.enc.Utf8)}
        </h1>
      </div>
      <div>
        <Link href={"/Login"} className="flex flex-col">
          <button className="text-black w-max dark:text-white rounded-2xl p-4 bg-red-300 dark:bg-red-900 hover:bg-red-400 dark:hover:bg-red-700 self-end">
            <div className="flex flex-row">
              <span className="flex-1">Cerrar Sesión</span>
              <ArrowLeftEndOnRectangleIcon className="h-7 w-7 text-black  dark:text-white" />
            </div>
          </button>
        </Link>
      </div>
    </div>
  );
}
