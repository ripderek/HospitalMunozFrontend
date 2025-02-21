//Este MsBoxB tiene dos botones uno para confirmar y otro para cancelar ajajaja skere modo diablo
export default function Msbox({ Mensaje, Titulo, cerrar, aceptar }) {
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
            <div className="flex flex-row items-end justify-end">
              <button
                className="p-3 text-slate-800 font-semibold dark:text-white underline"
                onClick={cerrar}
              >
                Cancelar
              </button>
              <button
                className="ml-3 p-3 bg-blue-600 rounded-3xl font-semibold text-white "
                onClick={aceptar}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
