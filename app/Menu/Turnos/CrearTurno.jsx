import { PlayIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import Msbox from "../../components/Layout/Msbox";
import Loader from "../../components/Layout/Loader";
import BuscarPacientes from "./BuscarPacientes";
import BuscarDepartamento from "./BuscarDepartamento";
import MsboxB from "../../components/Layout/MsboxB";
import axios from "axios";
import { useApiContext } from "../../context/ApiContext";
import ImprimirTurno from "./ImprimirTurno";
import CryptoJS from "crypto-js";
import Cookies from "universal-cookie";
export default function CrearTurno({ actualizarLista }) {
  const secretKey = "SECRET_KEY";
  const cookies = new Cookies();
  const param1 = cookies.get("param6") || "";
  const param1bytes = CryptoJS.AES.decrypt(param1, secretKey);

  const { apiUrl } = useApiContext();
  const FechaActual = new Date();
  const handleChange = (event) => {
    SetCupo({
      ...Cupo,
      metodoPago: event.target.value,
    });
  };
  const handleChangeDepartamento = (deparid, depar) => {
    console.log(deparid, depar);
    SetCupo({
      ...Cupo,
      departamento: depar,
      departamentoid: deparid,
    });
  };
  useEffect(() => {
    ListarDepartamentos();
  }, []);

  const [turnoID, setturnoID] = useState();
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
  //  estado para los modales
  const [Alertas, SetAlertas] = useState({
    BuscarPacientes: false,
    BuscarDepartamento: false,
  });
  //Objeto con la informacion para registrar del cupo
  const [Cupo, SetCupo] = useState({
    departamentoid: "",
    departamento: "",
    pacienteID: 0,
    paciente: "",
    metodoPago: "",
    valor: 0,
    identificacionID: param1bytes.toString(CryptoJS.enc.Utf8),
  });
  //retornar los datos del departamento seleccionado
  const AceptarDepartamento = (departamentoid, departamento) => {
    SetAlertas({ ...Alerta, BuscarDepartamento: false });
    SetCupo({
      ...Cupo,
      departamentoid: departamentoid,
      departamento: departamento,
    });
  };
  const AceptarPaciente = (pacienteID, paciente) => {
    SetAlertas({ ...Alerta, BuscarDepartamento: false });
    SetCupo({
      ...Cupo,
      pacienteID: pacienteID,
      paciente: paciente,
    });
  };
  const GenerarCupo = (event) => {
    event.preventDefault();

    console.log(Cupo);
    if (VerficarInformacion()) return null;
    SetAlertaB({
      ...AlertaB,
      Open: true,
      Titulo: "Generar turno",
      Mensaje: `¿Está seguro que los datos ingresados son correctos?`,
    });

    //handleDownloadPdf();
  };
  const VerficarInformacion = () => {
    const isEmpty = (str) => !str.trim();

    if (isEmpty(Cupo.departamento)) {
      alert("Ingrese el departamento");
      setLoader(false);
      return true;
    }
    if (isEmpty(Cupo.paciente)) {
      alert("Ingrese el paciente");
      setLoader(false);
      return true;
    }
    if (isEmpty(Cupo.metodoPago)) {
      alert("Ingrese el metodo de pago");
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

  //aqui se tiene que guardar en la BASE DE DATOS
  //debe retornar el id del tuno para poderlo ver e imprimir skere modo diablo
  const GuardarTurno = async () => {
    //e.preventDefault();
    SetAlertaB({ ...AlertaB, Open: false });
    try {
      setLoader(true);

      const result = await axios.post(apiUrl + "turno/crearTurno", Cupo, {
        withCredentials: true,
      });

      setturnoID(result.data);
      setLoader(false);
      SetCupo({
        ...Cupo,
        paciente: "",
        pacienteID: 0,
        valor: 0,
        departamento: "",
      });
      actualizarLista();
    } catch (error) {
      setLoader(false);
      alert("Error");
      console.log(error);
    }
  };
  const [ListaDepartamentos, SetListaDepartamentos] = useState([]);
  const ListarDepartamentos = async () => {
    //e.preventDefault();
    setLoader(true);
    try {
      //si no se llena la informacion se sale de esta funcion y no se envia nada al backend
      const result = await axios.post(
        apiUrl + "departamento/busquedaDepartamentos",
        { PalabraClave: "" },
        {
          withCredentials: true,
        }
      );
      //console.log(result.data);
      SetListaDepartamentos(result.data);
      //console.log(result.data);
      setLoader(false);
    } catch (error) {
      console.log(error);
      setLoader(false);
      alert("Error en la peticion de ListarDepartamentos");
    }
  };

  return (
    <>
      {/* PARA IMPRIMIR EL TURNO  <ImprimirTurno /> */}
      {turnoID != 0 && turnoID && (
        <ImprimirTurno turnoID={turnoID} cerrar={() => setturnoID(0)} />
      )}
      {/* PARA BUSCAR PACIENTES */}
      {Alertas.BuscarPacientes && (
        <BuscarPacientes
          cerrar={() => SetAlertas({ ...Alerta, BuscarPacientes: false })}
          aceptar={AceptarPaciente}
        />
      )}
      {Alertas.BuscarDepartamento && (
        <BuscarDepartamento
          cerrar={() => SetAlertas({ ...Alerta, BuscarDepartamento: false })}
          aceptar={AceptarDepartamento}
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

            {/*
            <div className="w-[60vh] gap-2  flex flex-col">
              <p className="text-lg">Departamento</p>

              <div className="flex flex-row gap-2  p-2 w-full rounded-2xl   bg-white ">
                <input
                  placeholder="Ejemplo: A/Medico Principal"
                  className={` flex-1 text-black`}
                  name="usuario"
                  //onChange={HandleChange}
                  value={Cupo.departamento}
                  disabled
                />
                <button
                  className="p-2 "
                  onClick={() =>
                    SetAlertas({ ...Alerta, BuscarDepartamento: true })
                  }
                >
                  <MagnifyingGlassIcon className="h-7 w-7 text-black hover:text-slate-500 " />
                </button>
              </div>
            </div> */}

            <div className="w-[60vh] gap-2  flex flex-col">
              <p className="text-lg">Paciente</p>

              <div className="flex flex-row gap-2  p-4 rounded-2xl   bg-white  w-full">
                <input
                  placeholder="Ejemplo: Raul Coello"
                  className={` flex-1 text-black focus:outline-none`}
                  name="paciente"
                  onChange={(e) =>
                    SetCupo({ ...Cupo, paciente: e.target.value })
                  }
                  value={Cupo.paciente}
                  //disabled
                />
                {/** <button
                  className="p-2 "
                  onClick={() =>
                    SetAlertas({ ...Alerta, BuscarPacientes: true })
                  }
                >
                  <MagnifyingGlassIcon className="h-7 w-7 text-black hover:text-slate-500 " />
                </button> */}
              </div>
            </div>
            <div className="w-[60vh] gap-2 flex flex-col">
              <p className="text-lg">Seleccionar departamento</p>

              <div className="flex flex-row gap-2 p-4 w-full rounded-2xl bg-white">
                <select
                  id="combobox"
                  value={Cupo.departamentoid} // El valor siempre tendrá un valor predeterminado
                  onChange={(e) => {
                    const selectedDeptId = parseInt(e.target.value, 10);
                    const selectedDept = ListaDepartamentos.find(
                      (dept) => dept.departamentoid === selectedDeptId
                    )?.departamento;
                    handleChangeDepartamento(selectedDeptId, selectedDept);
                  }}
                  className="text-black text-lg focus:outline-none block w-full rounded-md focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="" disabled>
                    Seleccione un departamento
                  </option>

                  {ListaDepartamentos &&
                    ListaDepartamentos.length !== 0 &&
                    ListaDepartamentos.map(
                      ({ departamentoid, departamento }) => (
                        <option key={departamentoid} value={departamentoid}>
                          {departamento}
                        </option>
                      )
                    )}
                </select>
              </div>
            </div>
            <div className="w-[60vh] gap-2  flex flex-col">
              <p className="text-lg">Método de pago</p>

              <div className="flex flex-row gap-2  p-4 w-full rounded-2xl   bg-white ">
                <select
                  id="combobox"
                  value={Cupo.metodoPago}
                  onChange={handleChange}
                  className="text-black text-lg focus:outline-none block w-full rounded-md  focus:border-indigo-500 focus:ring-indigo-500 "
                >
                  <option value="" disabled>
                    Selecciona una opción
                  </option>
                  <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                  <option value="Tarjeta de Débito">Tarjeta de Débito</option>
                  <option value="Transferencia bancaria">
                    Transferencia bancaria
                  </option>
                  <option value="Efectivo">Efectivo</option>
                </select>
              </div>
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
                <div className="text-center ">
                  <h1 className="text-2xl">TURNO</h1>
                  <h1 className="text-3xl font-bold mt-2 ">
                    {Cupo.departamento ? Cupo.departamento : "DEPARTAMENTO"}
                  </h1>
                </div>
                <div className="mt-6">
                  <p className="text-center text-lg">
                    {Cupo.paciente ? Cupo.paciente : "PACIENTE"}
                  </p>
                  <div className="flex flex-row  gap-3 justify-center">
                    <p className="text-center text-lg font-bold">
                      {" "}
                      {Cupo.valor ? `$${Cupo.valor}` : "$ Valor"}
                    </p>
                    <p className="text-center text-lg">
                      {" "}
                      {Cupo.metodoPago ? Cupo.metodoPago : "Tipo pago"}
                    </p>
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
              Generar turno
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
