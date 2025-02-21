//import anim from "../../../public/Anim/loader.json";
//import Lottie from "lottie-react";
export default function Msbox({ Mensaje, Titulo, cerrar, Tipo }) {
  "font-normal transition-colors hover:text-blue-500 focus:text-blue-500 text-white";
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50 ">
      <div className="w-[55vh] ">
        <div className="bg-white dark:bg-gray-950 p-3  rounded-3xl animate-fade-in">
          <div className=" h-full w-full flex flex-col p-4">
            <h1 className=" flex-1 text-3xl font-semibold text-blue-800 dark:text-white">
              {Titulo}
            </h1>

            <p className="mt-4 mb-4">{Mensaje}</p>
            <button
              className="p-3 bg-blue-600 rounded-3xl font-semibold text-white self-end"
              onClick={cerrar}
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
