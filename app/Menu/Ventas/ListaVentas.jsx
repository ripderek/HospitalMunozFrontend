import { useState, useEffect } from "react";
import Loader from "../../components/Layout/Loader";
import { TrashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { useApiContext } from "../../context/ApiContext";
import MsboxB from "../../components/Layout/MsboxB";
import axios from "axios";
import CryptoJS from "crypto-js";
import Cookies from "universal-cookie";
export default function ListaVentas({ reload }) {
  const { apiUrl, obtenerFechaFormato } = useApiContext();
  const secretKey = "SECRET_KEY";
  const cookies = new Cookies();
  const param1 = cookies.get("param6") || "";
  const param1bytes = CryptoJS.AES.decrypt(param1, secretKey);
  const TABLE_HEAD = [
    "N",
    "Fecha",
    "Hora/Minuto",
    "Total",
    "Items",
    "Identificador",
    "Ver lista",
    "Eliminar",
  ];
  const [Lista, setLista] = useState([]);
  const [load, setLoader] = useState(false);
  const [turnoID, setturnoID] = useState();

  useEffect(() => {
    ObtenerLista();
  }, [reload]);

  const ObtenerLista = async () => {
    setLoader(true);
    try {
      const result = await axios.post(
        apiUrl + "ventas/Lista_usuario",
        {
          identificacion: param1bytes.toString(CryptoJS.enc.Utf8),
          fecha: obtenerFechaFormato(),
        },
        {
          withCredentials: true,
        }
      );
      //console.log(result.data);
      setLista(result.data);
      //console.log(data);
      setLoader(false);
    } catch (error) {
      console.log(`Error: ${error}`);
      alert("Error en la peticion ObtenerLista:turnos");
      setLoader(false);
    }
  };
  const [eliminarID, setEliminarID] = useState(0);
  const [AlertaC, SetAlertaC] = useState({
    Open: false,
    Titulo: "",
    Mensaje: "",
  });
  const [Alerta, SetAlerta] = useState({
    Open: false,
    Titulo: "",
    Mensaje: "",
    Tipo: "",
  });
  const ConfirmarEliminar = (id) => {
    setEliminarID(id);

    SetAlertaC({
      ...AlertaC,
      Open: true,
      Titulo: "Confirmación",
      Mensaje: `¿Está seguro que desea eliminar?`,
    });
  };

  const Eliminar = async () => {
    SetAlertaC({ ...AlertaC, Open: false });
    setLoader(true);
    try {
      //si no se llena la informacion se sale de esta funcion y no se envia nada al backend
      const result = await axios.post(
        apiUrl + "ventas/Eliminar",
        { p_ventaid: eliminarID },

        {
          withCredentials: true,
        }
      );
      SetAlerta({
        ...Alerta,
        Open: true,
        Titulo: "Eliminado",
        Mensaje: `Se ha eliminado la venta`,
        Tipo: "Fail",
      });
      ObtenerLista();
      setLoader(false);
    } catch (error) {
      console.log(error);
      setLoader(false);
      SetAlerta({
        ...Alerta,
        Open: true,
        Titulo: "Error",
        Mensaje: ` ${error.response.data.error}`,
        Tipo: "Fail",
      });
    }
  };

  return (
    <div className="p-4 gap-2">
      {load && <Loader />}
      {/* AQUI DEBER IR PARA PODER VER LA FACTURA
      {turnoID != 0 && turnoID && (
        <ImprimirTurno turnoID={turnoID} cerrar={() => setturnoID(0)} />
      )}
     */}
      {AlertaC.Open && (
        <MsboxB
          Mensaje={AlertaC.Mensaje}
          Titulo={AlertaC.Titulo}
          cerrar={() => SetAlertaC({ ...AlertaC, Open: false })}
          aceptar={() => Eliminar()}
        />
      )}
      <div
        id="lista"
        className="bg-blue-100 dark:bg-black/40  w-full rounded-2xl p-10 items-center justify-center content-center flex flex-row gap-6 "
      >
        <div className="rounded-3xl bg-slate-50 dark:bg-transparent  p-2 ">
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
                  (
                    {
                      ventaid,
                      fecha,
                      hora_minutos,
                      identificador,
                      totalventa,
                      items,
                    },
                    index
                  ) => {
                    const isLast = index === Lista.length - 1;
                    const classes = isLast
                      ? "p-2"
                      : "p-2 border-b border-blue-gray-50";

                    return (
                      <tr
                        key={parseInt(ventaid)}
                        className="text-black dark:text-white hover:dark:bg-slate-300  hover:dark:text-black hover:bg-blue-50"
                      >
                        <td className={classes}>
                          <p className="font-normal">{index + 1}</p>
                        </td>
                        <td className={classes}>
                          <p className="font-bold">{fecha}</p>
                        </td>

                        <td className={classes}>
                          <p className="font-normal">{hora_minutos}</p>
                        </td>
                        <td className={classes}>
                          <p className="font-normal">${totalventa}</p>
                        </td>
                        <td className={classes}>
                          <p className="font-bold text-center">{items}</p>
                        </td>
                        <td className={classes}>
                          <p className="font-bold text-center">
                            {identificador}
                          </p>
                        </td>

                        <td className={classes}>
                          <button
                            className="hover:bg-blue-950 bg-blue-800 h-10 w-auto  text-center rounded-2xl items-center content-center"
                            //onClick={() => setturnoID(turnoidr)}
                          >
                            <EyeIcon className="h-10 w-10 text-white  p-2" />
                          </button>
                        </td>

                        <td className={classes}>
                          <button
                            className="hover:bg-red-950 bg-red-800 w-auto h-10  text-center rounded-2xl items-center content-center"
                            onClick={() => ConfirmarEliminar(ventaid)}
                          >
                            <TrashIcon className="h-10 w-10 text-white  p-2" />
                          </button>
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
  );
}
