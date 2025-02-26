import { useState } from "react";
import axios from "axios";
import Loader from "../../components/Layout/Loader";
import { useApiContext } from "../../context/ApiContext";
import Msbox from "../../components/Layout/Msbox";

export default function CambiarContra({ cerrar, datosEditar }) {
  const { apiUrl } = useApiContext();

  const [usuarioEdit, setUsuarioEdit] = useState(datosEditar);
  const [load, setLoader] = useState(false);
  const [Alerta, SetAlerta] = useState({
    Open: false,
    Titulo: "",
    Mensaje: "",
  });
  const Actualizar = async () => {
    setLoader(true);
    try {
      //si no se llena la informacion se sale de esta funcion y no se envia nada al backend
      const result = await axios.post(
        apiUrl + "personal/editarContrasenaUsuarioPersonal",
        usuarioEdit,
        {
          withCredentials: true,
        }
      );
      SetAlerta({
        ...Alerta,
        Open: true,
        Titulo: "Actualizado",
        Mensaje: `Se ha actualizado la contraseña del usuario`,
      });

      setLoader(false);
    } catch (error) {
      console.log(error);
      setLoader(false);
      SetAlerta({
        ...Alerta,
        Open: true,
        Titulo: "Error",
        Mensaje: ` ${error.response.data.error}`,
      });
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50 ">
      <div className="w-max ">
        <div className="bg-white dark:bg-gray-950 p-3  rounded-3xl animate-fade-in">
          {load && <Loader />}
          {Alerta.Open && (
            <Msbox
              Mensaje={Alerta.Mensaje}
              Titulo={Alerta.Titulo}
              cerrar={() => (
                SetAlerta({ ...Alerta, Open: false }), cerrar(true)
              )}
              Tipo={Alerta.Tipo}
            />
          )}
          <div className=" h-full w-full flex flex-col p-4">
            <h1 className=" flex-1 text-3xl font-semibold text-blue-800 dark:text-white">
              Credenciales de sesión
            </h1>
            <div className="p-2">
              <p className="text-lg">Usuario:</p>

              <input
                placeholder="Ejemplo: Herrera"
                className="flex-1 focus:outline-none gap-2 dark:bg-white  p-2 w-full rounded-xl  bg-slate-200 text-slate-600"
                name="apellidos"
                //onChange={HandleChange}
                value={usuarioEdit.username}
                disabled
              />

              <p className="text-lg">Contraseña:</p>

              <input
                placeholder="Ejemplo: 9999999999"
                className="flex-1 focus:outline-none gap-2  dark:bg-white  p-2 w-full rounded-xl  bg-slate-200 text-black"
                name="identificacion"
                onChange={(e) =>
                  setUsuarioEdit({ ...usuarioEdit, contra: e.target.value })
                }
                value={usuarioEdit.contra}
              />
            </div>
            <div className="flex flex-row items-end justify-end">
              <button
                className="p-3 text-slate-800 font-semibold dark:text-white underline"
                onClick={cerrar}
              >
                Cancelar
              </button>
              <button
                className="ml-3 p-3 bg-blue-600 rounded-3xl font-semibold text-white "
                onClick={() => Actualizar()}
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
