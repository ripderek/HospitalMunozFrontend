import { PlayIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import Msbox from "../../components/Layout/Msbox";
import Loader from "../../components/Layout/Loader";
import MsboxB from "../../components/Layout/MsboxB";
import axios from "axios";
import { useApiContext } from "../../context/ApiContext";
import ImprimirHonorario from "./ImprimirHonorario";
import CryptoJS from "crypto-js";
import Cookies from "universal-cookie";
export default function CrearHonorario({ actualizarLista }) {
  const secretKey = "SECRET_KEY";
  const cookies = new Cookies();
  const param1 = cookies.get("param8") || "";
  const param1bytes = CryptoJS.AES.decrypt(param1, secretKey);

  const { apiUrl } = useApiContext();
  const FechaActual = new Date();

  const [Alerta, SetAlerta] = useState({
    Open: false,
    Titulo: "",
    Mensaje: "",
    Tipo: "",
  });
  const [AlertaB, SetAlertaB] = useState({
    Open: false,
    Titulo: "",
    Mensaje: "",
  });
  const [load, setLoader] = useState(false);

  //Objeto con la informacion para registrar del cupo
  const [Cupo, SetCupo] = useState({
    nombre: "",
    motivo: "",
    valor: 0,
    numerocuenta: "",
    banco: "",
    usuarioid: param1bytes.toString(CryptoJS.enc.Utf8),
  });

  const GenerarCupo = (event) => {
    event.preventDefault();

    if (VerficarInformacion()) return null;
    SetAlertaB({
      ...AlertaB,
      Open: true,
      Titulo: "Guardar Honorario",
      Mensaje: `¿Está seguro que los datos ingresados son correctos?`,
    });
  };
  const VerficarInformacion = () => {
    const isEmpty = (str) => !str.trim();

    if (isEmpty(Cupo.nombre)) {
      alert("Ingrese el nombre");
      setLoader(false);
      return true;
    }

    if (isEmpty(Cupo.motivo)) {
      alert("Ingrese el motivo");
      setLoader(false);
      return true;
    }
    if (isEmpty(Cupo.numerocuenta)) {
      alert("Ingrese el numerocuenta");
      setLoader(false);
      return true;
    }
    if (isEmpty(Cupo.banco)) {
      alert("Ingrese el banco");
      setLoader(false);
      return true;
    }

    //verficar el numero
    // Verificar si el campo `valor` es un decimal válido y mayor o igual a 0
    const isValidDecimal = (value) => {
      const decimalRegex = /^\d+(\.\d+)?$/; // Solo números y punto decimal
      return decimalRegex.test(value) && parseFloat(value) > 0;
    };

    if (!isValidDecimal(Cupo.valor)) {
      // alert(Cupo.valor);
      alert("El valor debe ser un número decimal válido mayor a 0");
      setLoader(false);
      return true;
    }
    return false; //no hubo ningun error
  };

  const GuardarTurno = async () => {
    //e.preventDefault();
    SetAlertaB({ ...AlertaB, Open: false });
    try {
      setLoader(true);

      const result = await axios.post(apiUrl + "honorarios/Crear", Cupo, {
        withCredentials: true,
      });

      //setturnoID(result.data);
      setLoader(false);
      //copiar el mismo objeto para enviarlo a imprimir
      const fecha = new Date(); // Ejemplo: nueva fecha actual
      const fecha_p = fecha.toLocaleDateString("es-ES"); // "21/02/2025"
      const hora_p = fecha.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }); // "18:34"

      CambiarValoresHonorarioImpresion(
        fecha_p,
        Cupo.nombre,
        Cupo.motivo,
        Cupo.valor,
        Cupo.numerocuenta,
        Cupo.banco,
        true,
        hora_p
      );
      SetCupo({
        ...Cupo,
        nombre: "",
        motivo: "",
        valor: 0,
        numerocuenta: "",
        banco: "",
      });

      actualizarLista();
    } catch (error) {
      setLoader(false);
      alert("Error");
      console.log(error);
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
  const HandleChange = (e) => {
    SetCupo({ ...Cupo, [e.target.name]: e.target.value });
  };
  return (
    <>
      {/* PARA IMPRIMIR EL TURNO  <ImprimirHonorario /> */}

      {informacionHonorario.ver && (
        <ImprimirHonorario
          informacionHonorario={informacionHonorario}
          cerrar={() =>
            CambiarValoresHonorarioImpresion("", "", "", "", "", "", false, "")
          }
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
      {AlertaB.Open && (
        <MsboxB
          Mensaje={AlertaB.Mensaje}
          Titulo={AlertaB.Titulo}
          cerrar={() => SetAlertaB({ ...AlertaB, Open: false })}
          aceptar={GuardarTurno}
        />
      )}
      <div className="p-4 gap-2">
        <div
          id="form"
          className="bg-blue-100 dark:bg-black/40  w-full rounded-2xl p-10 items-center justify-center content-center flex flex-row gap-6 "
        >
          <form
            onSubmit={GenerarCupo}
            id="miFormulario"
            className="w-full  rounded-2xl p-10 bg-blue-200 dark:bg-slate-950/30 gap-3  flex flex-col content-center items-center"
          >
            <h1 className="text-4xl font-bold">Datos:</h1>

            <div className="w-[60vh] gap-2  flex flex-col">
              <p className="text-lg">Nombre</p>
              <input
                placeholder="Ejemplo: Raul Coello"
                className={` flex-1 text-black focus:outline-none p-4 rounded-2xl`}
                name="nombre"
                onChange={HandleChange}
                value={Cupo.nombre}
              />
            </div>
            <div className="w-[60vh] gap-2  flex flex-col">
              <p className="text-lg">Motivo</p>
              <input
                placeholder="Ejemplo: PAGO FACTURA LITARDO"
                className={` flex-1 text-black focus:outline-none p-4 rounded-2xl`}
                name="motivo"
                onChange={HandleChange}
                value={Cupo.motivo}
              />
            </div>
            <div className="w-[60vh] gap-2  flex flex-col">
              <p className="text-lg">Numero de cuenta</p>
              <input
                placeholder="2202098722"
                className={` flex-1 text-black focus:outline-none p-4 rounded-2xl`}
                name="numerocuenta"
                onChange={HandleChange}
                value={Cupo.numerocuenta}
              />
            </div>
            <div className="w-[60vh] gap-2  flex flex-col">
              <p className="text-lg">Banco</p>
              <input
                placeholder="AHORRO PICHINCHA"
                className={` flex-1 text-black focus:outline-none p-4 rounded-2xl`}
                name="banco"
                onChange={HandleChange}
                value={Cupo.banco}
              />
            </div>

            <div className="w-[60vh] gap-2  flex flex-col">
              <p className="text-lg">Valor</p>

              <div className="flex flex-row gap-2  p-4 w-full rounded-2xl   bg-white ">
                <input
                  placeholder="Ejemplo: 10.50"
                  className={` flex-1 text-black focus:outline-none`}
                  name="valor"
                  type="text"
                  value={Cupo.valor}
                  onChange={(e) => SetCupo({ ...Cupo, valor: e.target.value })}
                />
              </div>
            </div>
          </form>
          <div className=" w-[80vh]">
            <div>
              <div className="w-96 h-96  rounded-2xl p-4 bg-white  gap-3  flex flex-col text-black">
                <div className="text-center mt-4">Logo</div>
                <div className="mt-6">
                  <span className="font-bold">Fecha:</span>
                  {`${String(FechaActual.getDate()).padStart(2, "0")}/${String(
                    FechaActual.getMonth() + 1
                  ).padStart(2, "0")}/${FechaActual.getFullYear()}`}{" "}
                  {"     "}
                  <span className="font-bold ml-3">Hora:</span> --//--
                </div>
                {/* AQUI VA EL CUERPO */}
                <div className="flex flex-col gap-3">
                  <div>
                    <span className="font-bold">NOMBRE: </span>
                    {Cupo.nombre}
                  </div>
                  <div>
                    <span className="font-bold">MOTIVO: </span>
                    {Cupo.motivo}
                  </div>
                  <div>
                    <span className="font-bold">VALOR : </span>${Cupo.valor}
                  </div>
                  <div>
                    <span className="font-bold">NUMERO DE CUENTA : </span>
                    {Cupo.numerocuenta}
                  </div>
                  <div>
                    <span className="font-bold">BANCO : </span>
                    {Cupo.banco}
                  </div>
                </div>
              </div>
            </div>
            <button
              className="p-2 bg-blue-800 w-full text-center mt-6 rounded-2xl font-bold text-white text-xl flex content-center justify-center items-center"
              onClick={GenerarCupo}
              type="submit"
              form="miFormulario"
            >
              <PlayIcon className="h-10 w-10 text-white  p-2" />
              Guardar Honorario
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
