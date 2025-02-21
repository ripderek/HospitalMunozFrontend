import { useState, useEffect } from "react";
import MsboxB from "@/app/components/Layout/MsboxB";
import axios from "axios";
import CryptoJS from "crypto-js";
import Cookies from "universal-cookie";
import { useApiContext } from "../../context/ApiContext";
import Loader from "@/app/components/Layout/Loader";
import EscogerPersonal from "./EscogerPersonal";
export default function Cerrar() {
  const [fechaHora, setFechaHora] = useState(new Date());

  const { apiUrl } = useApiContext();
  const secretKey = "SECRET_KEY";
  const cookies = new Cookies();
  const param1 = cookies.get("param8") || "";
  const param1bytes = CryptoJS.AES.decrypt(param1, secretKey);
  useEffect(() => {
    const intervalo = setInterval(() => {
      setFechaHora(new Date()); // Actualiza la fecha y hora cada segundo
    }, 1000);

    return () => clearInterval(intervalo); // Limpia el intervalo al desmontar
  }, []);

  // Formatear la fecha y hora en formato: DD/MM/YYYY HH:MM:SS
  const formatoFechaHora = fechaHora.toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const [AlertaB, SetAlertaB] = useState({
    Open: false,
    Titulo: "",
    Mensaje: "",
  });
  const ConfirmarCierre = () => {
    SetAlertaB({
      ...AlertaB,
      Open: true,
      Titulo: "Generar turno",
      Mensaje: `¿Está seguro que desea cerrar turno? Esta acción no se puede revertir`,
    });
  };
  const [load, setLoader] = useState(false);

  const CerrarTurno = async () => {
    SetAlertaB({ ...AlertaB, Open: false });
    setLoader(true);
    try {
      const result = await axios.post(
        apiUrl + `personal/cierreTurnoPersonal`,
        {
          usuarioid_p: parseInt(param1bytes.toString(CryptoJS.enc.Utf8)),
          //fecha: obtenerFechaFormato(),
        },
        {
          withCredentials: true,
        }
      );
      alert("Turno Cerrado");
      //aqui crear una nueva cookie para no mostrar las rutas y que no puedan acceder a ninguna wea skere modo diablo
      cookies.set(
        "param9",
        CryptoJS.AES.encrypt("Cerrado", secretKey).toString(),
        {
          path: "/",
        }
      );
      window.location.reload();

      //console.log(data);
      setLoader(false);
    } catch (error) {
      console.log(error);
      alert("Error en la peticion Cerrar");
      setLoader(false);
    }
  };
  return (
    <>
      {load && <Loader />}
      {AlertaB.Open && (
        <MsboxB
          Mensaje={AlertaB.Mensaje}
          Titulo={AlertaB.Titulo}
          cerrar={() => SetAlertaB({ ...AlertaB, Open: false })}
          aceptar={CerrarTurno}
        />
      )}
      <div className="p-4 gap-2">
        <div className="text-center items-center justify-center content-center bg-blue-100 dark:bg-black/40  w-full rounded-2xl p-10  flex flex-col gap-6 ">
          <EscogerPersonal />
          <div className="text-5xl">{formatoFechaHora}</div>
          <button
            className=" p-4 rounded-3xl bg-blue-950 text-xl text-white "
            onClick={() => ConfirmarCierre()}
          >
            Cerrar Caja
          </button>
        </div>
      </div>
    </>
  );
}
