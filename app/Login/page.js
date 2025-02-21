"use client";
import { useState } from "react";
import anim from "../../public/Anim/Animation_Home.json";
// Carga Lottie de forma dinámica solo en el cliente
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import axios from "axios";
import Loader from "../components/Layout/Loader";
import Msbox from "../components/Layout/Msbox";
import Cookies from "universal-cookie";
import { useRouter } from "next/navigation";
import { useApiContext } from "../context/ApiContext";
import CryptoJS from "crypto-js";

export default function Home() {
  const secretKey = "SECRET_KEY";

  const { apiUrl } = useApiContext();

  const router = useRouter();
  //hacer la funcion para hacer el login
  const [Login, SetLogin] = useState({
    usuario: "",
    password: "",
  });
  //variable para mostrar el loader cuando carga una peticion
  const HandleChange = (e) => {
    SetLogin({ ...Login, [e.target.name]: e.target.value });
  };
  const [Alerta, SetAlerta] = useState({
    Open: false,
    Titulo: "",
    Mensaje: "",
    Tipo: "",
  });

  const [load, setLoader] = useState(false);
  const IncioSesion = async (e) => {
    e.preventDefault();
    //process.env.NEXT_PUBLIC_ACCESLINK
    //Router.push("/Inicio");

    setLoader(true);
    if (VerficarInformacion()) return null;

    try {
      //si no se llena la informacion se sale de esta funcion y no se envia nada al backend
      const result = await axios.post(apiUrl + "auth/AuthVerification", Login, {
        withCredentials: true,
      });
      //console.log(result.data);
      const cookies = new Cookies();
      //Cookie para el token
      cookies.set("myTokenName", result.data.token, { path: "/" }); //enviar cokiee y almacenarla
      cookies.set(
        "param1",
        CryptoJS.AES.encrypt(result.data.nombresr, secretKey).toString(),
        { path: "/" }
      );
      cookies.set(
        "param2",
        CryptoJS.AES.encrypt(result.data.apellidosr, secretKey).toString(),
        { path: "/" }
      );
      cookies.set(
        "param3",
        CryptoJS.AES.encrypt(result.data.numerocelularr, secretKey).toString(),
        { path: "/" }
      );
      cookies.set(
        "param4",
        CryptoJS.AES.encrypt(result.data.tipopersonafr, secretKey).toString(),
        { path: "/" }
      );
      cookies.set(
        "param5",
        CryptoJS.AES.encrypt(result.data.usernamer, secretKey).toString(),
        { path: "/" }
      );
      cookies.set(
        "param6",
        CryptoJS.AES.encrypt(result.data.identificacionr, secretKey).toString(),
        {
          path: "/",
        }
      );
      cookies.set(
        "param7",
        CryptoJS.AES.encrypt(result.data.correopersonalr, secretKey).toString(),
        {
          path: "/",
        }
      );
      cookies.set(
        "param8",
        CryptoJS.AES.encrypt(String(result.data.useridr), secretKey).toString(),
        {
          path: "/",
        }
      );
      cookies.set(
        "param9",
        CryptoJS.AES.encrypt(
          result.data.cierreturno
            ? result.data.tipopersonafr !== "Administrador"
              ? "HaCerradoTurno"
              : "SInC3rr@rTurnoUSu@ri0_$i$tem"
            : "SInC3rr@rTurnoUSu@ri0_$i$tem",
          secretKey
        ).toString(),
        {
          path: "/",
        }
      );
      router.push("/Menu", { scroll: false });

      //  setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log(error);
      SetAlerta({
        ...Alerta,
        Open: true,
        Titulo: "Error",
        Mensaje: error.response?.data?.error || "Error en la petición",

        Tipo: "Fail",
      });
    }
  };
  //verificar que los datos esten llenos
  const VerficarInformacion = () => {
    const isEmpty = (str) => !str.trim();

    if (isEmpty(Login.usuario)) {
      alert("Ingrese el usuario");
      setLoader(false);

      return true;
    }
    if (isEmpty(Login.password)) {
      alert("Ingrese la contraseña");
      setLoader(false);

      return true;
    }
    return false; //no hubo ningun error
  };
  const InputClass =
    "dark:bg-transparent hover:border-blue-600 p-2 w-full border-[2px] rounded-lg  border-gray-400 bg-white dark:bg-gray-800 focus:outline-none ";
  const aClass = "hover:bg-slate-200 p-3 rounded-lg dark:hover:bg-[#111213]";
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
      {/* Cuerpo */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div
          className=" rounded-3xl p-4 
            bg-white dark:bg-black flex flex-col md:flex-row w-full md:w-[160vh]"
        >
          <div className=" content-center flex-1">
            <Lottie animationData={anim} className="h-[40vh] mx-auto" />
          </div>

          <div className="w-96">
            <form
              onSubmit={IncioSesion}
              className=" p-10 z-10 text-slate-700 dark:text-slate-50 gap-6 flex flex-col  content-center items-center justify-center self-center"
            >
              <h2 className="text-4xl text-slate-800 font-semibold dark:text-white">
                Iniciar sesión
              </h2>

              <div className="w-full gap-2  flex flex-col">
                <p>Usuario</p>
                <input
                  placeholder="ejemplo: user1"
                  className={`${InputClass} `}
                  name="usuario"
                  onChange={HandleChange}
                  required
                />
                <p>Contraseña</p>
                <input
                  placeholder="****"
                  className={`${InputClass}`}
                  name="password"
                  onChange={HandleChange}
                  required
                  type="password"
                />
              </div>
              <button
                className="bg-blue-700 hover:bg-blue-900 font-semibold text-lg w-28 p-2 text-white rounded-3xl self-end"
                type="submit"
              >
                Aceptar
              </button>
            </form>
          </div>
        </div>
        {/* FOOTER DEL CUADRO DE INICIO DE SESION  */}
        <div className="flex flex-row text-slate-800 text-sm dark:text-white">
          <div className="flex-1 p-3">
            <a href="#" className={`${aClass}`}>
              Hospital Munoz
            </a>
          </div>
          <div className="flex-row flex">
            <a href="#" className={`${aClass}`}>
              Extintor
            </a>
            <a href="#" className={`${aClass}`}>
              Licencia
            </a>
            <a href="#" className={`${aClass}`}>
              Acerca de
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
