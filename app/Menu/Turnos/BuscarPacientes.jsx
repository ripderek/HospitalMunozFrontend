"use client";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useState } from "react";
import Loader from "../../components/Layout/Loader";
import { useApiContext } from "../../context/ApiContext";

export default function BuscarPacientes({ cerrar, aceptar }) {
  const { apiUrl } = useApiContext();

  const [PalabraClave, setPalabraCLave] = useState("");

  const handleCloseOutside = (e) => {
    // Cuando se hace clic fuera del modal
    cerrar();
  };

  const handleInsideClick = (e) => {
    // Evita que el clic dentro del modal cierre el modal
    e.stopPropagation();
  };
  const [ListaResultados, SetListaResultados] = useState([]);
  const [load, setLoader] = useState(false);
  const TABLE_HEAD = ["N", "Paciente"];

  //funcion para buscar
  const Buscar = async (e) => {
    e.preventDefault();
    setLoader(true);

    try {
      //si no se llena la informacion se sale de esta funcion y no se envia nada al backend
      const result = await axios.post(
        apiUrl + "paciente/busquedaPacientes",
        { PalabraClave: PalabraClave },
        {
          withCredentials: true,
        }
      );
      //console.log(result.data);
      SetListaResultados(result.data);
      setLoader(false);
    } catch (error) {
      console.log(error);
      setLoader(false);
      alert("Error en la peticion de busqueda");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={handleCloseOutside} // Cierra el modal si haces clic fuera de él
    >
      {/* PARA VER EL LOADER    */}
      {load && <Loader />}
      <div
        className="w-[70vh]"
        onClick={handleInsideClick} // Evita cerrar el modal al hacer clic dentro
      >
        <div className="bg-white dark:bg-gray-950 p-3 rounded-3xl animate-fade-in">
          <div className="h-full w-full flex flex-col p-4">
            <div className="flex flex-row">
              <form
                onSubmit={Buscar}
                className="flex flex-row gap-2  p-2 w-full rounded-2xl   bg-blue-100 dark:bg-transparent dark:border-2"
              >
                <input
                  placeholder="Buscar paciente"
                  className={` flex-1 bg-blue-100 focus:outline-none text-black dark:bg-transparent dark:text-white `}
                  name="palabraclave"
                  onChange={(e) => setPalabraCLave(e.target.value)}
                  //disabled
                />
                <button className="p-2 " type="submit">
                  <MagnifyingGlassIcon className="h-7 w-7 text-black hover:text-slate-500 dark:text-white" />
                </button>
              </form>
            </div>
            {/* Aqui mostrar los resultados si se realizo la busqeuda skere modo diablo */}
            <div className="rounded-3xl mt-3">
              {ListaResultados && ListaResultados.length != 0 ? (
                <table className="w-full min-w-max table-auto text-left rounded-2xl">
                  <thead>
                    <tr className="border-b border-blue-gray-100 rounded-2xl bg-blue-100 dark:bg-black/40 p-4">
                      {TABLE_HEAD.map((head) => (
                        <th key={head} className="p-4  ">
                          <h1 className="font-semibold text-slate-800 dark:text-white leading-none opacity-70 ">
                            {head}
                          </h1>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ListaResultados.map(({ pacienteid, paciente }, index) => {
                      const isLast = index === ListaResultados.length - 1;
                      const classes = isLast
                        ? "p-2"
                        : "p-2 border-b border-blue-gray-50";

                      return (
                        <tr
                          key={parseInt(index)}
                          className="cursor-pointer text-black dark:text-white hover:dark:bg-slate-300  hover:dark:text-black hover:bg-blue-50"
                          onClick={() => aceptar(pacienteid, paciente)}
                        >
                          <td className={classes}>
                            <p className="font-normal">{index + 1}</p>
                          </td>
                          <td className={classes}>
                            <p className="font-normal">{paciente}</p>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
