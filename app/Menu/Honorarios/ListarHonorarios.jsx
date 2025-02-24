import { useState, useEffect } from "react";
import Loader from "../../components/Layout/Loader";
import { TrashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { useApiContext } from "../../context/ApiContext";
import ImprimirHonorario from "./ImprimirHonorario";
import MsboxB from "../../components/Layout/MsboxB";
import axios from "axios";
import CryptoJS from "crypto-js";
import Cookies from "universal-cookie";

export default function ListarHonorarios({ reload }) {
  const { apiUrl, obtenerFechaFormato } = useApiContext();
  const secretKey = "SECRET_KEY";
  const cookies = new Cookies();
  const param1 = cookies.get("param8") || "";
  const param1bytes = CryptoJS.AES.decrypt(param1, secretKey);
  const TABLE_HEAD = [
    "N",
    "Hora/Minuto",
    "Nombre",
    "Cuenta",
    "Banco",
    "Valor",
    "Ver recibo",
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
        apiUrl + `honorarios/fu_lista_honorarios_id_usuario_fecha`,
        {
          usuarioid: parseInt(param1bytes.toString(CryptoJS.enc.Utf8)),
          fecha: obtenerFechaFormato(),
        },
        {
          withCredentials: true,
        }
      );
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
        apiUrl + "honorarios/Eliminar",
        { honorarioid: eliminarID },

        {
          withCredentials: true,
        }
      );
      SetAlerta({
        ...Alerta,
        Open: true,
        Titulo: "Eliminado",
        Mensaje: `Se ha eliminado el honorario`,
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
  const [informacionHonorario, setinformacionHonorario] = useState({
    fecha: "",
    nombre: "",
    motivo: "",
    valor: "",
    numerocuenta: "",
    banco: "",
    ver: false,
    hora: "",
  });
  const CambiarValoresHonorarioImpresion = (
    fecha_p,
    nombre_p,
    motivo_p,
    valor_p,
    numerocuenta_p,
    banco_p,
    ver_p,
    hora_p
  ) => {
    setinformacionHonorario({
      ...informacionHonorario,
      fecha: fecha_p,
      nombre: nombre_p,
      motivo: motivo_p,
      valor: valor_p,
      numerocuenta: numerocuenta_p,
      banco: banco_p,
      ver: ver_p,
      hora: hora_p,
    });
  };
  return (
    <div className="p-4 gap-2">
      {load && <Loader />}

      {informacionHonorario.ver && (
        <ImprimirHonorario
          informacionHonorario={informacionHonorario}
          cerrar={() =>
            CambiarValoresHonorarioImpresion("", "", "", "", "", "", false, "")
          }
        />
      )}

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
                      honorarioid,
                      horaminutos,
                      fecha,
                      nombre,
                      motivo,
                      valor,
                      numerocuenta,
                      banco,
                    },
                    index
                  ) => {
                    const isLast = index === Lista.length - 1;
                    const classes = isLast
                      ? "p-2"
                      : "p-2 border-b border-blue-gray-50";

                    return (
                      <tr
                        key={parseInt(index)}
                        className="text-black dark:text-white hover:dark:bg-slate-300  hover:dark:text-black hover:bg-blue-50"
                      >
                        <td className={classes}>
                          <p className="font-normal">{index + 1}</p>
                        </td>
                        <td className={classes}>
                          <p className="font-bold text-center">{horaminutos}</p>
                        </td>

                        <td className={classes}>
                          <p className="font-normal">{nombre}</p>
                        </td>
                        <td className={classes}>
                          <p className="font-normal">{numerocuenta}</p>
                        </td>
                        <td className={classes}>
                          <p className="font-normal">{banco}</p>
                        </td>
                        <td className={classes}>
                          <p className="font-bold text-center">${valor}</p>
                        </td>
                        {/*
                        <td className={classes}>
                          <p className="text-sm text-black bg-yellow-300 rounded-xl p-1 font-bold ">
                            {estado}
                          </p>
                        </td>
                       */}

                        <td className={`${classes} items-center text-center`}>
                          <button
                            className="justify-center hover:bg-blue-950 bg-blue-800 h-10 w-auto  text-center rounded-2xl items-center content-center"
                            onClick={() =>
                              CambiarValoresHonorarioImpresion(
                                fecha,
                                nombre,
                                motivo,
                                valor,
                                numerocuenta,
                                banco,
                                true,
                                horaminutos
                              )
                            }
                          >
                            <EyeIcon className="h-10 w-10 text-white  p-2" />
                          </button>
                        </td>

                        <td className={`${classes} items-center text-center`}>
                          <button
                            className="hover:bg-red-950 bg-red-800 w-auto h-10  text-center rounded-2xl items-center content-center"
                            onClick={() => ConfirmarEliminar(honorarioid)}
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
