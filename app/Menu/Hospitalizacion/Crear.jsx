import { FolderArrowDownIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import Msbox from "../../components/Layout/Msbox";
import axios from "axios";
import Loader from "../../components/Layout/Loader";
import { useApiContext } from "../../context/ApiContext";
import CryptoJS from "crypto-js";
import Cookies from "universal-cookie";
export default function Crear({ actualizarLista }) {
  const secretKey = "SECRET_KEY";
  const cookies = new Cookies();
  const param1 = cookies.get("param8") || "";
  const param1bytes = CryptoJS.AES.decrypt(param1, secretKey);
  const { apiUrl } = useApiContext();
  const [load, setLoader] = useState(false);

  const [Datos, SetDatos] = useState({
    nombre: "",
    procedimeinto: "",
    habitacion: "",
    userid: parseInt(param1bytes.toString(CryptoJS.enc.Utf8)),
  });
  const HandleChange = (e) => {
    SetDatos({ ...Datos, [e.target.name]: e.target.value });
  };
  const [Alerta, SetAlerta] = useState({
    Open: false,
    Titulo: "",
    Mensaje: "",
    Tipo: "",
  });
  //funcion para guardar los datos:
  const Crear = async (e) => {
    e.preventDefault();
    setLoader(true);
    if (VerficarInformacion()) return null;

    try {
      //si no se llena la informacion se sale de esta funcion y no se envia nada al backend
      const result = await axios.post(apiUrl + `hospitalizacion/Crear`, Datos, {
        withCredentials: true,
      });
      SetAlerta({
        ...Alerta,
        Open: true,
        Titulo: "Registrado",
        Mensaje: "Hospitalizacion registrada",
        Tipo: "Fail",
      });
      SetDatos({
        ...Datos,
        habitacion: "",
        procedimeinto: "",
        nombre: "",
      });

      //reload()
      actualizarLista();
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
  const VerficarInformacion = () => {
    const isEmpty = (str) => !str.trim();

    if (isEmpty(Datos.habitacion)) {
      alert("Ingrese la habitacion");
      setLoader(false);
      return true;
    }

    if (isEmpty(Datos.nombre)) {
      alert("Ingrese el nombre");
      setLoader(false);
      return true;
    }

    if (isEmpty(Datos.procedimeinto)) {
      alert("Ingrese el procedimeinto");
      setLoader(false);
      return true;
    }
    return false; //no hubo ningun error
  };
  return (
    <div
      id="form"
      className="w-full  h-full rounded-2xl p-10 bg-blue-200 dark:bg-slate-950/30 gap-3  flex flex-col content-center items-center"
    >
      {load && <Loader />}
      {Alerta.Open && (
        <Msbox
          Mensaje={Alerta.Mensaje}
          Titulo={Alerta.Titulo}
          cerrar={() => SetAlerta({ ...Alerta, Open: false })}
          Tipo={Alerta.Tipo}
        />
      )}
      <h1 className="text-4xl font-bold">Datos:</h1>
      <div className="w-[60vh]  ">
        <form onSubmit={Crear} className="  flex flex-col gap-2">
          <p className="text-lg">Nombre:</p>
          <input
            placeholder="Ejemplo: Raul Coello"
            className="flex-1 focus:outline-none gap-2  p-4 w-full rounded-2xl   bg-white text-black"
            name="nombre"
            onChange={HandleChange}
            value={Datos.nombre}
            type="text"
          />
          <p className="text-lg">Procedimiento:</p>
          <input
            placeholder="Ejemplo: Suero"
            className="flex-1 focus:outline-none gap-2  p-4 w-full rounded-2xl   bg-white text-black"
            name="procedimeinto"
            onChange={HandleChange}
            value={Datos.procedimeinto}
            type="text"
          />
          <p className="text-lg">Habitacion:</p>
          <input
            placeholder="Ejemplo: Habitacion 1"
            className="flex-1 focus:outline-none gap-2  p-4 w-full rounded-2xl   bg-white text-black"
            name="habitacion"
            onChange={HandleChange}
            value={Datos.habitacion}
            type="text"
          />

          <button
            className="hover:bg-blue-950 p-2 bg-blue-800 w-80 self-end text-center mt-6 rounded-2xl font-bold text-white text-xl flex content-center justify-center items-center"
            type="submit"
          >
            <FolderArrowDownIcon className="h-10 w-10 text-white  p-2" />
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
}
