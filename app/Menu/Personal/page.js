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
import CambiarContra from "./CambiarContra";
export default function Personal() {
  const { apiUrl } = useApiContext();
  const infoComponent = {
    NameComponent: "Personal",
    MinusName: "personal",
    SingularName: "personal",
    Descripcion: "Aqui puedes gestionar el personal",
  };
  useEffect(() => {
    ObtenerLista();
    ObtenerListaTipoPersona();
  }, []);
  const [ListaTipoPersona, SetListaTipoPersona] = useState([]);
  const ObtenerLista = async () => {
    setLoader(true);
    try {
      const response = await fetch(apiUrl + "personal/verTurno", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      SetLista(data);
      //console.log(data);
      setLoader(false);
    } catch (error) {
      console.log(`Error: ${error}`);
      alert("Error en la peticion ObtenerLista:pacientes");
      setLoader(false);
    }
  };

  const ObtenerListaTipoPersona = async () => {
    setLoader(true);
    try {
      const response = await fetch(apiUrl + "personal/listarTiposPersonas", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      SetListaTipoPersona(data);
      //console.log(data);
      setLoader(false);
    } catch (error) {
      console.log(`Error: ${error}`);
      alert("Error en la peticion ObtenerListaTipoPersona");
      setLoader(false);
    }
  };
  const [Lista, SetLista] = useState([]);
  const [Alerta, SetAlerta] = useState({
    Open: false,
    Titulo: "",
    Mensaje: "",
    Tipo: "",
  });
  const [Personal, SetPersonal] = useState({
    personaID: "",
    identificacion: "",
    correoPersonal: "",
    numeroCelular: "",
    tipoPersonaF: "",
    nombres: "",
    apellidos: "",
  });
  //variable para mostrar el loader cuando carga una peticion
  const HandleChange = (e) => {
    SetPersonal({ ...Personal, [e.target.name]: e.target.value });
  };

  const [load, setLoader] = useState(false);

  //verificar que los datos esten llenos
  const VerficarInformacion = () => {
    const isEmpty = (str) => !str.trim();

    if (isEmpty(Personal.nombres)) {
      alert("Ingrese nombres");
      setLoader(false);
      return true;
    }
    if (isEmpty(Personal.apellidos)) {
      alert("Ingrese apellidos");
      setLoader(false);
      return true;
    }
    if (isEmpty(Personal.identificacion)) {
      alert("Ingrese apellidos");
      setLoader(false);
      return true;
    }
    if (isEmpty(Personal.correoPersonal)) {
      alert("Ingrese correo");
      setLoader(false);
      return true;
    }
    if (isEmpty(Personal.numeroCelular)) {
      alert("Ingrese numero celular");
      setLoader(false);
      return true;
    }
    if (isEmpty(Personal.tipoPersonaF)) {
      alert("Ingrese tipoPersona");
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
    else Crear();
  };

  const Crear = async (e) => {
    setLoader(true);
    if (VerficarInformacion()) return null;
    console.log(Personal);

    try {
      //si no se llena la informacion se sale de esta funcion y no se envia nada al backend
      const result = await axios.post(
        apiUrl + "personal/crearUsuarioPersonal",
        Personal,
        {
          withCredentials: true,
        }
      );
      SetAlerta({
        ...Alerta,
        Open: true,
        Titulo: "Creado",
        Mensaje: "Personal creado",
        Tipo: "Fail",
      });
      SetPersonal({
        ...Personal,
        identificacion: "",
        correoPersonal: "",
        numeroCelular: "",
        tipoPersonaF: "",
        nombres: "",
        apellidos: "",
      });

      //SetPaciente({ ...Paciente, pacienteID: 0, paciente: "" });

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
        apiUrl + "personal/actualizarDatosPersona",
        Personal,
        {
          withCredentials: true,
        }
      );
      SetAlerta({
        ...Alerta,
        Open: true,
        Titulo: "Creado",
        Mensaje: "Personal editado",
        Tipo: "Fail",
      });
      SetPersonal({
        ...Personal,
        personaID: 0,
        nombres: "",
        apellidos: "",
        correoPersonal: "",
        identificacion: "",
        numeroCelular: "",
        tipoPersonaF: "",
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
  const TABLE_HEAD = ["N", "Datos Personales", "Sesión", "Editar", "Eliminar"];
  const [AlertaC, SetAlertaC] = useState({
    Open: false,
    Titulo: "",
    Mensaje: "",
  });

  const [DatosEliminar, SetDatosEliminar] = useState({
    usuarioID_p: 0,
    personaID_P: 0,
  });
  const ConfirmarEliminar = (pID, usID) => {
    SetDatosEliminar({ ...DatosEliminar, personaID_P: pID, usuarioID_p: usID });
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
        apiUrl + "personal/eliminarUsuarioPersonal",
        DatosEliminar,
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
  const ClickEditar = (
    personaidr,
    nombresr,
    apellidosr,
    identificacionr,
    correopersonalr,
    numerocelularr,
    tipopersonafr
  ) => {
    setEditando(true);
    SetPersonal({
      ...Personal,
      personaID: personaidr,
      nombres: nombresr,
      apellidos: apellidosr,
      correoPersonal: correopersonalr,
      identificacion: identificacionr,
      numeroCelular: numerocelularr,
      tipoPersonaF: tipopersonafr,
    });
  };
  const [Editando, setEditando] = useState(false);
  const [usuarioEditar, SetusuarioEditar] = useState({
    userid: 0,
    username: "",
    contra: "",
  });
  const CerrarCambiarContra = (indicador) => {
    SetusuarioEditar({ ...usuarioEditar, username: "" });
    if (indicador) ObtenerLista();
  };

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
        apiUrl + `personal/listarPersonalBusqueda`,
        { palabraClave: PalabraClave },
        {
          withCredentials: true,
        }
      );
      //console.log(result.data);
      SetLista(result.data);

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
      {/*PARA EDITAR LA CONTRASENA */}
      {usuarioEditar.username && (
        <CambiarContra
          cerrar={CerrarCambiarContra}
          datosEditar={usuarioEditar}
        />
      )}
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
            className="w-full  h-max rounded-2xl p-10 bg-blue-200 dark:bg-slate-950/30 gap-3  flex flex-col content-center items-center"
          >
            {Editando && (
              <div className=" w-full bg-red-500 text-white font-bold p-2 rounded-2xl text-center text-xl animate-fade-in">
                Editando Datos
              </div>
            )}
            <h1 className="text-4xl font-bold">Datos:</h1>
            <div className="w-[60vh]  ">
              <form onSubmit={GuardarDatos} className="  flex flex-col gap-2">
                <p className="text-lg">Nombres:</p>

                <input
                  placeholder="Ejemplo: Jhon"
                  className="flex-1 focus:outline-none gap-2  p-2 w-full rounded-xl   bg-white text-black"
                  name="nombres"
                  onChange={HandleChange}
                  value={Personal.nombres}
                />
                <p className="text-lg">Apellidos:</p>

                <input
                  placeholder="Ejemplo: Herrera"
                  className="flex-1 focus:outline-none gap-2   p-2 w-full rounded-xl  bg-white text-black"
                  name="apellidos"
                  onChange={HandleChange}
                  value={Personal.apellidos}
                />

                <p className="text-lg">Identificación:</p>

                <input
                  placeholder="Ejemplo: 9999999999"
                  className="flex-1 focus:outline-none gap-2   p-2 w-full rounded-xl  bg-white text-black"
                  name="identificacion"
                  onChange={HandleChange}
                  value={Personal.identificacion}
                  maxLength={10}
                />
                <p className="text-lg">Correo:</p>

                <input
                  placeholder="Ejemplo: micorreo@gmail.com"
                  className="flex-1 focus:outline-none gap-2   p-2 w-full rounded-xl  bg-white text-black"
                  name="correoPersonal"
                  onChange={HandleChange}
                  value={Personal.correoPersonal}
                />
                <p className="text-lg">Celular:</p>

                <input
                  placeholder="Ejemplo: 09xxxxxxxx"
                  className="flex-1 focus:outline-none gap-2   p-2 w-full rounded-xl  bg-white text-black"
                  name="numeroCelular"
                  onChange={HandleChange}
                  value={Personal.numeroCelular}
                  maxLength={10}
                />
                <p className="text-lg">Tipo de usuario:</p>

                <div className="flex flex-row gap-2  p-2 w-full rounded-xl   bg-white ">
                  <select
                    id="combobox"
                    value={Personal.tipoPersonaF}
                    onChange={(event) =>
                      SetPersonal({
                        ...Personal,
                        tipoPersonaF: event.target.value,
                      })
                    }
                    className="text-black text-lg focus:outline-none block w-full rounded-md  focus:border-indigo-500 focus:ring-indigo-500 "
                  >
                    <option value="" disabled>
                      Selecciona una opción
                    </option>
                    {ListaTipoPersona &&
                      ListaTipoPersona.length !== 0 &&
                      ListaTipoPersona.map(({ tipopersona }, index) => (
                        <option key={index} value={tipopersona}>
                          {tipopersona}
                        </option>
                      ))}
                  </select>
                </div>
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
                  //onChange={HandleChange}
                  value={PalabraClave}
                  onChange={(e) => SetPalabraClave(e.target.value)}
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
                        (
                          {
                            useridr,
                            usernamer,
                            contrasenar,
                            personaidr,
                            identificacionr,
                            correopersonalr,
                            numerocelularr,
                            tipopersonafr,
                            apellidosr,
                            nombresr,
                          },
                          index
                        ) => {
                          const isLast = index === Lista.length - 1;
                          const classes = isLast
                            ? "p-2"
                            : "p-2 border-b border-blue-gray-50";

                          return (
                            <tr
                              key={index}
                              className="text-black dark:text-white hover:dark:bg-slate-300  hover:dark:text-black hover:bg-blue-50"
                            >
                              <td className={classes}>
                                <p className="font-normal">{index + 1}</p>
                              </td>
                              <td className={classes}>
                                <div className="flex flex-col">
                                  <p className="font-normal">
                                    {`${apellidosr} `}
                                  </p>
                                  <p className="font-normal">{`${nombresr}`}</p>
                                  <p className="font-normal text-xs">
                                    C.I: {identificacionr}
                                  </p>
                                  <p className="font-normal text-xs">
                                    {correopersonalr}
                                  </p>
                                  <p className="font-normal text-xs">
                                    {numerocelularr}
                                  </p>
                                  <p className="font-bold text-sm p-1 rounded-lg w-max text-black bg-blue-100">
                                    {tipopersonafr}
                                  </p>
                                </div>
                              </td>
                              <td className={classes}>
                                <a
                                  onClick={() =>
                                    SetusuarioEditar({
                                      ...usuarioEditar,
                                      userid: useridr,
                                      contra: contrasenar,
                                      username: usernamer,
                                    })
                                  }
                                  className="font-normal p-2 bg-blue-400 text-black rounded-xl cursor-pointer"
                                >
                                  {usernamer}
                                </a>
                              </td>
                              <td className={classes}>
                                <button
                                  className="hover:bg-blue-950 bg-blue-800 h-10 w-auto  text-center rounded-2xl items-center content-center"
                                  onClick={() =>
                                    ClickEditar(
                                      personaidr,
                                      nombresr,
                                      apellidosr,
                                      identificacionr,
                                      correopersonalr,
                                      numerocelularr,
                                      tipopersonafr
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
                                    ConfirmarEliminar(personaidr, useridr)
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
