"use client";
import anim from "../../../public/Anim/abstract1.json";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  FolderArrowDownIcon,
  TrashIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import Msbox from "../../components/Layout/Msbox";
import MsboxB from "../../components/Layout/MsboxB";
import axios from "axios";
import Loader from "../../components/Layout/Loader";
import { useApiContext } from "../../context/ApiContext";

export default function Procedimientos() {
  const { apiUrl } = useApiContext();
  const infoComponent = {
    NameComponent: "Procedimientos",
    MinusName: "procedimientos",
    SingularName: "procedimiento",
    Descripcion: "Aqui puedes gestionar los procedimientos",
  };
  useEffect(() => {
    ObtenerLista();
  }, []);
  const ObtenerLista = async () => {
    setLoader(true);
    try {
      const response = await fetch(
        apiUrl + "procedimiento/listarProcedimientos",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      SetListarProcedimientos(data);
      //console.log(data);
      setLoader(false);
    } catch (error) {
      console.log(`Error: ${error}`);
      alert("Error en la peticion ObtenerLista:procedimientos");
      setLoader(false);
    }
  };
  const [ListaProcedimientos, SetListarProcedimientos] = useState([]);
  const [Alerta, SetAlerta] = useState({
    Open: false,
    Titulo: "",
    Mensaje: "",
    Tipo: "",
  });
  const [Procedimiento, SetProcedimiento] = useState({
    procedimientoID: 0,
    procedimiento: "",
    valor: "",
  });
  //variable para mostrar el loader cuando carga una peticion
  const HandleChange = (e) => {
    SetProcedimiento({ ...Procedimiento, [e.target.name]: e.target.value });
  };

  const [load, setLoader] = useState(false);

  //verificar que los datos esten llenos
  const VerficarInformacion = () => {
    const isEmpty = (str) => !str.trim();

    if (isEmpty(Procedimiento.procedimiento)) {
      alert("Ingrese el procedimiento");
      setLoader(false);
      return true;
    }
    //verficar el numero
    // Verificar si el campo `valor` es un decimal válido y mayor o igual a 0
    const isValidDecimal = (value) => {
      const decimalRegex = /^\d+(\.\d+)?$/; // Solo números y punto decimal
      return decimalRegex.test(value) && parseFloat(value) >= 0;
    };

    if (!isValidDecimal(Procedimiento.valor)) {
      alert("El precio debe ser un número decimal válido mayor o igual a 0");
      setLoader(false);
      return true;
    }
    return false; //no hubo ningun error
  };
  const GuardarDatos = (e) => {
    ///
    //setEditando(false);
    //si esta editando entonces manda a otra funcion skere modo diablo
    //
    e.preventDefault();
    if (Editando) Editar();
    else CrearProcedimiento();
  };

  const CrearProcedimiento = async (e) => {
    setLoader(true);
    if (VerficarInformacion()) return null;

    try {
      //si no se llena la informacion se sale de esta funcion y no se envia nada al backend
      const result = await axios.post(
        apiUrl + "procedimiento/crearProcedimientos",
        Procedimiento,
        {
          withCredentials: true,
        }
      );
      SetAlerta({
        ...Alerta,
        Open: true,
        Titulo: "Creado",
        Mensaje: "Procedimiento creado",
        Tipo: "Fail",
      });
      SetProcedimiento({
        ...Procedimiento,
        procedimientoID: 0,
        procedimiento: "",
        valor: "",
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
  //Editar
  const Editar = async (e) => {
    setLoader(true);
    if (VerficarInformacion()) return null;
    try {
      //{apiUrl}
      //si no se llena la informacion se sale de esta funcion y no se envia nada al backend
      const result = await axios.post(
        apiUrl + "procedimiento/editarProcedimiento",
        Procedimiento,
        {
          withCredentials: true,
        }
      );
      SetAlerta({
        ...Alerta,
        Open: true,
        Titulo: "Creado",
        Mensaje: "Procedimiento editado",
        Tipo: "Fail",
      });
      SetProcedimiento({
        ...Procedimiento,
        procedimientoID: 0,
        procedimiento: "",
        valor: "",
      });
      ObtenerLista();
      setLoader(false);
      setEditando(false);
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
  const TABLE_HEAD = ["N", "Procedimiento", "Precio", "Editar", "Eliminar"];
  const [AlertaC, SetAlertaC] = useState({
    Open: false,
    Titulo: "",
    Mensaje: "",
  });
  const ConfirmarEliminar = (id) => {
    SetProcedimiento({ ...Procedimiento, procedimientoID: id });

    SetAlertaC({
      ...AlertaC,
      Open: true,
      Titulo: "Confirmación",
      Mensaje: `¿Está seguro que desea eliminar?`,
    });
  };
  //funcion para elimar la wea fobe
  const Eliminar = async () => {
    SetAlertaC({ ...AlertaC, Open: false });
    setLoader(true);
    try {
      //si no se llena la informacion se sale de esta funcion y no se envia nada al backend
      const result = await axios.post(
        apiUrl + "procedimiento/eliminarProcedimiento",
        Procedimiento,
        {
          withCredentials: true,
        }
      );
      SetAlerta({
        ...Alerta,
        Open: true,
        Titulo: "Eliminado",
        Mensaje: `Se ha eliminado el ${infoComponent.SingularName}`,
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
  const ClickEditar = (id, depart, valor) => {
    setEditando(true);
    SetProcedimiento({
      ...Procedimiento,
      procedimientoID: id,
      procedimiento: depart,
      valor: valor < 1 ? `0${valor}` : valor,
    });
  };
  const [Editando, setEditando] = useState(false);
  const [PalabraClave, SetPalabraClave] = useState("");
  const Busqueda = (e) => {
    e.preventDefault();
    const isEmpty = (str) => !str.trim();
    //si la palabraclave esta vacia entonces listar por defecto sino realizar la busqueda
    if (isEmpty(PalabraClave)) ObtenerLista();
    else ObtenerListaBusqueda();
  };
  const ObtenerListaBusqueda = async () => {
    setLoader(true);
    try {
      const result = await axios.post(
        apiUrl + `procedimiento/listarProcedimientosBusqueda`,
        { PalabraClave: PalabraClave },
        {
          withCredentials: true,
        }
      );
      //console.log(result.data);
      SetListarProcedimientos(result.data);

      //console.log(data);
      setLoader(false);
    } catch (error) {
      console.log(error);
      alert("Error en la peticion ObtenerLista:procedimientos");
      setLoader(false);
    }
  };
  return (
    <>
      {/* PARA VER EL LOADER    */}
      {load && <Loader />}
      {Alerta.Open && (
        <Msbox
          Mensaje={Alerta.Mensaje}
          Titulo={Alerta.Titulo}
          cerrar={() => SetAlerta({ ...Alerta, Open: false })}
          Tipo={Alerta.Tipo}
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
      {/* HEADER COMPONENT */}
      <div className="flex flex-row p-4 gap-2">
        <div className="bg-blue-100 dark:bg-black/40  w-full rounded-2xl p-10 items-center justify-center content-center">
          <h1 className="text-5xl font-semibold">
            {infoComponent.NameComponent}
          </h1>
          <p className="text-xl">{infoComponent.Descripcion}</p>
          <div className="mt-6">
            <a
              className=" p-4 rounded-3xl bg-blue-900 text-xl text-white "
              href="#form"
              //onClick={() => ObtenerLista()}
            >
              Empezar
            </a>
          </div>
        </div>
        <div className="bg-blue-200 dark:bg-black/20  w-full rounded-2xl p-4 overflow-hidden relative">
          <div className=" content-end self-end justify-end relative">
            <Lottie animationData={anim} className="h-[30vh] scale-150  " />
          </div>
        </div>
      </div>
      {/* BODY COMPONENT */}
      <div className="p-4 gap-2">
        <div className="bg-blue-100 dark:bg-black/40  w-full rounded-2xl p-10 flex flex-row gap-6 ">
          <div
            id="form"
            className="w-full  h-96 rounded-2xl p-10 bg-blue-200 dark:bg-slate-950/30 gap-3  flex flex-col content-center items-center"
          >
            {Editando && (
              <div className=" w-full bg-red-500 text-white font-bold p-2 rounded-2xl text-center text-xl animate-fade-in">
                Editando Datos
              </div>
            )}
            <h1 className="text-4xl font-bold">Datos:</h1>
            <div className="w-[60vh]  ">
              <form onSubmit={GuardarDatos} className="  flex flex-col">
                <p className="text-lg">Nombre del procedimiento:</p>
                <input
                  placeholder="Procedimiento ejemplo: Extracción de sangre"
                  className="flex-1 focus:outline-none gap-2  p-4 w-full rounded-2xl   bg-white text-black"
                  name="procedimiento"
                  onChange={HandleChange}
                  value={Procedimiento.procedimiento}
                />
                <p className="text-lg mt-2">Precio: $</p>
                <input
                  placeholder="Ejemplo: 10.00"
                  className="flex-1 focus:outline-none gap-2  p-4 w-full rounded-2xl   bg-white text-black"
                  name="valor"
                  //type=""
                  onChange={HandleChange}
                  value={Procedimiento.valor}
                />
                <button
                  className="hover:bg-blue-950 p-2 bg-blue-800 w-80 self-end text-center mt-6 rounded-2xl font-bold text-white text-xl flex content-center justify-center items-center"
                  type="submit"
                  // onClick={() => CrearDepartamento()}
                >
                  <FolderArrowDownIcon className="h-10 w-10 text-white  p-2" />
                  Guardar
                </button>
              </form>
            </div>
          </div>
          <div className=" w-full">
            <div className="rounded-2xl p-10  bg-white dark:bg-black/40 gap-3  flex flex-col text-black">
              <form
                onSubmit={Busqueda}
                className="flex flex-row gap-2  p-2 w-full rounded-2xl   bg-slate-50 "
              >
                <input
                  placeholder="Buscar"
                  className={` flex-1 focus:outline-none bg-slate-50`}
                  name="usuario"
                  value={PalabraClave}
                  onChange={(e) => SetPalabraClave(e.target.value)}
                />
                <button className="p-2 " type="submit">
                  <MagnifyingGlassIcon className="h-7 w-7 text-black hover:text-slate-500 " />
                </button>
              </form>
              <div className="rounded-3xl ">
                {ListaProcedimientos && ListaProcedimientos.length != 0 ? (
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
                      {ListaProcedimientos.map(
                        ({ procedimientoid, procedimiento, valor }, index) => {
                          const isLast =
                            index === ListaProcedimientos.length - 1;
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
                                <p className="font-normal">{procedimiento}</p>
                              </td>
                              <td className={classes}>
                                <p className="font-normal">
                                  $
                                  {valor < 1 ? ` 0${valor.trim()}` : `${valor}`}
                                </p>
                              </td>
                              <td className={classes}>
                                <button
                                  className="hover:bg-blue-950 bg-blue-800 h-10 w-auto  text-center rounded-2xl items-center content-center"
                                  onClick={() =>
                                    ClickEditar(
                                      procedimientoid,
                                      procedimiento,
                                      valor.trim()
                                    )
                                  }
                                >
                                  <PencilSquareIcon className="h-10 w-10 text-white  p-2" />
                                </button>
                              </td>

                              <td className={classes}>
                                <button
                                  className="hover:bg-red-950 bg-red-800 w-auto h-10  text-center rounded-2xl items-center content-center"
                                  onClick={() =>
                                    ConfirmarEliminar(procedimientoid)
                                  }
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
                    No hay {infoComponent.MinusName}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
