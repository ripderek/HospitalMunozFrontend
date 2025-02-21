import Loader from "../../components/Layout/Loader";
import { useApiContext } from "../../context/ApiContext";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import axios from "axios";

export default function ListaMedicinas({ RetornarRow }) {
  const { apiUrl } = useApiContext();
  const [load, setLoader] = useState(false);
  const [Lista, SetLista] = useState([]);
  const infoComponent = {
    Url: "medicina/",
  };
  const [palabraClave, SetpalabraClave] = useState("");
  const ObtenerLista = async () => {
    setLoader(true);
    try {
      const result = await axios.post(
        apiUrl + `${infoComponent.Url}Listar_Busqueda`,
        { palabraClave: palabraClave },
        {
          withCredentials: true,
        }
      );
      //console.log(result.data);
      SetLista(result.data);

      //console.log(data);
      setLoader(false);
    } catch (error) {
      console.log(`Error: ${error}`);
      alert("Error en la peticion ObtenerLista:procedimientos");
      setLoader(false);
    }
  };
  const TABLE_HEAD = ["N", "Medicina", "Precio"];

  return (
    <>
      {load && <Loader />}
      <div className=" w-full">
        <div className="rounded-2xl p-2  bg-white dark:bg-black/40 gap-3  flex flex-col text-black">
          <h1 className="text-xl p-2 dark:text-white">Medicamentos </h1>
          <div className="flex flex-row gap-2  p-2 w-full rounded-2xl   bg-slate-50 ">
            <input
              placeholder="Buscar"
              className={` flex-1 focus:outline-none bg-slate-50`}
              name="usuario"
              onChange={(e) => SetpalabraClave(e.target.value)}
            />
            <button className="p-2 " onClick={ObtenerLista}>
              <MagnifyingGlassIcon className="h-7 w-7 text-black hover:text-slate-500 " />
            </button>
          </div>
          <div className="rounded-3xl ">
            {Lista && Lista.length != 0 ? (
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
                  {Lista.map(({ medicinaid, medicina, valor }, index) => {
                    const isLast = index === Lista.length - 1;
                    const classes = isLast
                      ? "p-2"
                      : "p-2 border-b border-blue-gray-50";

                    return (
                      <tr
                        key={parseInt(index)}
                        className="text-black dark:text-white hover:dark:bg-slate-300  hover:dark:text-black hover:bg-blue-50 cursor-pointer"
                        onClick={() =>
                          RetornarRow({
                            medicinaid,
                            medicina,
                            valor,
                          })
                        }
                      >
                        <td className={classes}>
                          <p className="font-normal">{index + 1}</p>
                        </td>
                        <td className={classes}>
                          <p className="font-normal">{medicina}</p>
                        </td>
                        <td className={classes}>
                          <p className="font-normal">
                            ${valor < 1 ? ` 0${valor.trim()}` : `${valor}`}
                          </p>
                        </td>
                        {/* 
                            <td className={classes}>
                              <button
                                className="hover:bg-blue-950 bg-blue-800 h-10 w-auto  text-center rounded-2xl items-center content-center"
                                onClick={() =>
                                  ClickEditar(
                                    medicinaid,
                                    medicina,
                                    valor.trim()
                                  )
                                }
                              >
                                <PencilSquareIcon className="h-10 w-10 text-white  p-2" />
                              </button>
                            </td>
*/}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="font-bold text-center text-2xl text-slate-800 dark:text-white">
                No hay resultados
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
