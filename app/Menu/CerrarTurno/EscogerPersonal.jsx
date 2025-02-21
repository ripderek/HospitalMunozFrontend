import Loader from "@/app/components/Layout/Loader";
import { useApiContext } from "../../context/ApiContext";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import Cookies from "universal-cookie";
import { MinusCircleIcon } from "@heroicons/react/24/solid";

export default function EscogerPersonal() {
  const { apiUrl, obtenerFechaFormato } = useApiContext();
  const [load, setLoader] = useState(false);
  const [Lista, SetLista] = useState([]);
  const secretKey = "SECRET_KEY";
  const cookies = new Cookies();
  const param1 = cookies.get("param8") || "";
  const param1bytes = CryptoJS.AES.decrypt(param1, secretKey);
  const infoComponent = {
    Url: "medicina/",
  };
  const [palabraClave, SetpalabraClave] = useState("");
  const ObtenerLista = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const result = await axios.post(
        apiUrl + `personal/listarPersonalBusqueda`,
        { palabraClave: palabraClave },
        {
          withCredentials: true,
        }
      );
      //console.log(result.data);
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
  useEffect(() => {
    ObtenerPersonalCierreCaja();
  }, []);

  const [ListaPerosonal, setListaPersonal] = useState([]);
  const ObtenerPersonalCierreCaja = async () => {
    setLoader(true);
    try {
      const result = await axios.post(
        apiUrl + `turno/fu_lista_personal_cierre`,
        {
          userid: parseInt(param1bytes.toString(CryptoJS.enc.Utf8)),
          fecha: obtenerFechaFormato(),
        },
        {
          withCredentials: true,
        }
      );
      //console.log(result.data);
      setListaPersonal(result.data);

      //console.log(data);
      setLoader(false);
    } catch (error) {
      console.log(`Error: ${error}`);
      alert("Error en la peticion ObtenerLista:procedimientos");
      setLoader(false);
    }
  };
  const TABLE_HEAD = ["N", "Nombres"];
  const TABLE_HEAD_Personal = ["N", "Personal", "Quitar"];
  //eliminar el personal del cierre
  const EliminarPersonalCierre = async (idpersonal) => {
    setLoader(true);
    try {
      const result = await axios.post(
        apiUrl + `turno/eliminarPersonalCierreTurno`,
        {
          usuarioid_p: parseInt(param1bytes.toString(CryptoJS.enc.Utf8)),
          fecha_p: obtenerFechaFormato(),
          personaid_p: idpersonal,
        },
        {
          withCredentials: true,
        }
      );

      setLoader(false);
      ObtenerPersonalCierreCaja();
    } catch (error) {
      console.log(`Error: ${error}`);
      alert("Error en la peticion ObtenerLista:procedimientos");
      setLoader(false);
    }
  };
  const AgregarPersonalCierre = async (idpersonal) => {
    setLoader(true);
    try {
      const result = await axios.post(
        apiUrl + `turno/agregarPersonalCierreTurno`,
        {
          usuarioid_p: parseInt(param1bytes.toString(CryptoJS.enc.Utf8)),
          personaid_p: idpersonal,
        },
        {
          withCredentials: true,
        }
      );

      setLoader(false);
      ObtenerPersonalCierreCaja();
    } catch (error) {
      console.log(`Error: ${error}`);
      alert("Error en la peticion ObtenerLista:procedimientos");
      setLoader(false);
    }
  };
  return (
    <div className="p-4 gap-2">
      {load && <Loader />}

      <h1 className="text-2xl">Agregar personal para el cierre de caja</h1>
      <div className="bg-blue-100 dark:bg-black/40  w-full rounded-2xl p-10  flex flex-row gap-6 ">
        <div className=" w-[80vh]">
          <div className=" w-full">
            <div className="rounded-2xl p-2  bg-white dark:bg-black/40 gap-3  flex flex-col text-black">
              <h1 className="text-xl p-2 dark:text-white">Personal </h1>
              <form
                onSubmit={ObtenerLista}
                className="flex flex-row gap-2  p-2 w-full rounded-2xl   bg-slate-50 "
              >
                <input
                  placeholder="Buscar"
                  className={` flex-1 focus:outline-none bg-slate-50`}
                  name="usuario"
                  onChange={(e) => SetpalabraClave(e.target.value)}
                />
                <button className="p-2 " type="submit">
                  <MagnifyingGlassIcon className="h-7 w-7 text-black hover:text-slate-500 " />
                </button>
              </form>
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
                      {Lista.map(
                        ({ personaidr, apellidosr, nombresr }, index) => {
                          const isLast = index === Lista.length - 1;
                          const classes = isLast
                            ? "p-2"
                            : "p-2 border-b border-blue-gray-50";

                          return (
                            <tr
                              key={parseInt(index)}
                              className="text-black dark:text-white hover:dark:bg-slate-300  hover:dark:text-black hover:bg-blue-50 cursor-pointer"
                              onClick={() => AgregarPersonalCierre(personaidr)}
                            >
                              <td className={classes}>
                                <p className="font-normal">{index + 1}</p>
                              </td>
                              <td className={classes}>
                                <p className="font-normal">{`${apellidosr} ${nombresr}`}</p>
                              </td>
                            </tr>
                          );
                        }
                      )}
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
        </div>

        <div className="w-full  rounded-2xl p-5 bg-white dark:bg-slate-950/30 gap-3  flex flex-col ">
          {ListaPerosonal && ListaPerosonal.length != 0 ? (
            <table className="w-full min-w-max table-auto text-left rounded-2xl">
              <thead>
                <tr className="border-b border-blue-gray-100 rounded-2xl bg-blue-100 dark:bg-black/40 p-4">
                  {TABLE_HEAD_Personal.map((head) => (
                    <th key={head} className="p-4  ">
                      <h1 className="font-semibold text-slate-800 dark:text-white leading-none opacity-70 ">
                        {head}
                      </h1>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ListaPerosonal.map(({ personaid, persona }, index) => {
                  const isLast = index === ListaPerosonal.length - 1;
                  const classes = isLast
                    ? "p-2"
                    : "p-2 border-b border-blue-gray-50";

                  return (
                    <tr
                      key={parseInt(index)}
                      className="text-black dark:text-white hover:dark:bg-slate-300  hover:dark:text-black hover:bg-blue-50 cursor-pointer"
                    >
                      <td className={classes}>
                        <p className="font-normal">{index + 1}</p>
                      </td>
                      <td className={classes}>
                        <p className="font-normal">{persona}</p>
                      </td>
                      <td className={classes}>
                        {personaid > 0 ? (
                          <button
                            className="hover:bg-red-950 bg-red-800 h-10 w-auto  text-center rounded-2xl items-center content-center"
                            onClick={() => EliminarPersonalCierre(personaid)}
                          >
                            <MinusCircleIcon className="h-10 w-10 text-white  p-2" />
                          </button>
                        ) : (
                          ""
                        )}
                      </td>
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
  );
}
