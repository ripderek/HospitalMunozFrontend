import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import Msbox from "../../components/Layout/Msbox";
import MsboxB from "../../components/Layout/MsboxB";
import axios from "axios";
import Loader from "../../components/Layout/Loader";
import { useApiContext } from "../../context/ApiContext";
import CryptoJS from "crypto-js";
import Cookies from "universal-cookie";
import jsPDF from "jspdf";
import "jspdf-autotable";
export default function Listar({ reload }) {
  const secretKey = "SECRET_KEY";
  const cookies = new Cookies();
  const param1 = cookies.get("param8") || "";
  const param1bytes = CryptoJS.AES.decrypt(param1, secretKey);
  const { apiUrl, obtenerFechaFormato } = useApiContext();
  useEffect(() => {
    ObtenerLista();
  }, [reload]);
  const [Lista, SetLista] = useState([]);
  const [load, setLoader] = useState(false);
  /*
   const [fechas, setFechas] = useState({
    fecha_inicio: getFormattedDate(),
    fecha_fin: getFormattedDate(),
  });
  */

  const [fechasSelector, setFechasSelector] = useState({
    fecha_inicio: {
      dia: getDayFormated(),
      mes: getMonthFormated(),
      anio: getYearFormated(),
    },
    fecha_fin: {
      dia: getDayFormated(),
      mes: getMonthFormated(),
      anio: getYearFormated(),
    },
  });
  const ObtenerLista = async () => {
    setLoader(true);
    console.log(fechasSelector);
    let fechaInicio = `${fechasSelector.fecha_inicio.dia}${fechasSelector.fecha_inicio.mes}${fechasSelector.fecha_inicio.anio}`;
    let fechaFin = `${fechasSelector.fecha_fin.dia}${fechasSelector.fecha_fin.mes}${fechasSelector.fecha_fin.anio}`;
    console.log(fechaInicio + " --- " + fechaFin);
    try {
      const result = await axios.post(
        apiUrl + `hospitalizacion/Listar`,
        {
          iduser: parseInt(param1bytes.toString(CryptoJS.enc.Utf8)),
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
        },
        {
          withCredentials: true,
        }
      );
      //console.log(result.data);
      SetLista(result.data);
      //console.log(data);
      setLoader(false);
    } catch (error) {
      console.log(`Error: ${error}`);
      alert("Error en la peticion ObtenerLista:procedimientos");
      setLoader(false);
    }
  };
  const TABLE_HEAD = [
    "N",
    "Nombre",
    "Procedimiento",
    "Habitacion",
    "Fecha",
    "Hora/Minutos",
    "Eliminar",
  ];
  const [AlertaC, SetAlertaC] = useState({
    Open: false,
    Titulo: "",
    Mensaje: "",
  });
  const [EliminarIdentificador, setEliminarIdentificador] = useState("");
  const [Alerta, SetAlerta] = useState({
    Open: false,
    Titulo: "",
    Mensaje: "",
    Tipo: "",
  });
  const ConfirmarEliminar = (id) => {
    setEliminarIdentificador(id);
    SetAlertaC({
      ...AlertaC,
      Open: true,
      Titulo: "Confirmación",
      Mensaje: `¿Está seguro que desea eliminar?`,
    });
  }; //funcion para elimar la wea fobe
  const Eliminar = async () => {
    SetAlertaC({ ...AlertaC, Open: false });
    setLoader(true);
    try {
      //si no se llena la informacion se sale de esta funcion y no se envia nada al backend
      const result = await axios.post(
        apiUrl + `hospitalizacion/Eliminar`,
        {
          identificador: EliminarIdentificador,
        },
        {
          withCredentials: true,
        }
      );
      SetAlerta({
        ...Alerta,
        Open: true,
        Titulo: "Eliminado",
        Mensaje: `Se ha eliminado el registro de hospitalizacion`,
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
  /*  function getFormattedDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Los meses en JS van de 0 a 11
    const year = now.getFullYear();
    return `${day}${month}${year}`;
  }*/
  function getDayFormated() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    return `${day}`;
  }

  function getMonthFormated() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Los meses en JS van de 0 a 11
    return `${month}`;
  }

  function getYearFormated() {
    const now = new Date();
    const year = now.getFullYear();
    return `${year}`;
  }
  const generateOptions = (start, end) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const handleChange = (e, field, type) => {
    setFechasSelector((prev) => ({
      ...prev,
      [field]: { ...prev[field], [type]: e.target.value },
    }));
  };
  const generatePDF = () => {
    const doc = new jsPDF();
    const param1 = cookies.get("param1") || "";
    const param1bytes = CryptoJS.AES.decrypt(param1, secretKey);
    const param2 = cookies.get("param2") || "";
    const param2bytes = CryptoJS.AES.decrypt(param2, secretKey);

    const fechaInicio = `${fechasSelector.fecha_inicio.dia}/${fechasSelector.fecha_inicio.mes}/${fechasSelector.fecha_inicio.anio}`;
    const fechaFin = `${fechasSelector.fecha_fin.dia}/${fechasSelector.fecha_fin.mes}/${fechasSelector.fecha_fin.anio}`;
    const usuario = `${param1bytes.toString(
      CryptoJS.enc.Utf8
    )} ${param2bytes.toString(CryptoJS.enc.Utf8)}`;
    // Título
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Hospitalización", 105, 20, { align: "center" });

    // Información principal
    doc.setFontSize(12);
    doc.text("Fecha Inicio:", 20, 40);
    doc.setFont("helvetica", "normal");
    doc.text(fechaInicio, 60, 40);

    doc.setFont("helvetica", "bold");
    doc.text("Fecha Fin:", 20, 50);
    doc.setFont("helvetica", "normal");
    doc.text(fechaFin, 60, 50);

    doc.setFont("helvetica", "bold");
    doc.text("Usuario:", 20, 60);
    doc.setFont("helvetica", "normal");
    doc.text(usuario, 60, 60);

    // Espaciado antes de la tabla
    doc.setFontSize(10);

    // Configurar encabezados de la tabla
    const headers = ["#", "Nombre", "Procedimiento", "Habitación", "Fecha"];

    // Transformar los datos de Lista para la tabla
    const tableData = Lista.map((item, index) => [
      index + 1,
      item.nombre,
      item.procedimiento,
      item.habitacion,
      `${item.fecha} ${item.horas_minutos}`,
      //    doc.splitTextToSize(item.motivo, 60), // Ajustar texto largo
    ]);

    // Generar la tabla con autoTable
    doc.autoTable({
      startY: 70,
      head: [headers],
      body: tableData,
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: {
        6: { cellWidth: 60 }, // Ajustar ancho de la columna "Motivo"
      },
      margin: { top: 10 },
      didDrawPage: function (data) {
        // Encabezado en cada página
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Hospitalización", 105, 20, { align: "center" });
      },
    });

    // Guardar el PDF
    doc.save("hospitalizacion.pdf");
  };
  return (
    <div className=" w-full" id="Lista">
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
      <div className="rounded-2xl p-10  bg-white dark:bg-black/40 gap-3  flex flex-col text-black">
        <div className="flex flex-row">
          <div className="flex flex-row p-2">
            {/* SELECTORES */}
            <label className="block text-sm font-medium text-black dark:text-white p-2">
              Fecha Inicio:
            </label>
            <div className="flex gap-2">
              {/* Día */}
              <div className="flex-col flex text-center">
                <span className="text-black dark:text-white">Día</span>
                <select
                  className="border border-gray-300 rounded-md p-2"
                  value={fechasSelector.fecha_inicio.dia}
                  onChange={(e) => handleChange(e, "fecha_inicio", "dia")}
                >
                  {generateOptions(1, 31).map((num) => (
                    <option key={num} value={String(num).padStart(2, "0")}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mes */}
              <div className="flex-col flex text-center">
                <span className="text-black dark:text-white">Mes</span>
                <select
                  className="border border-gray-300 rounded-md p-2"
                  value={fechasSelector.fecha_inicio.mes}
                  onChange={(e) => handleChange(e, "fecha_inicio", "mes")}
                >
                  {generateOptions(1, 12).map((num) => (
                    <option key={num} value={String(num).padStart(2, "0")}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              {/* Año */}
              <div className="flex-col flex text-center">
                <span className="text-black dark:text-white">Año</span>
                <select
                  className="border border-gray-300 rounded-md p-2"
                  value={fechasSelector.fecha_inicio.anio}
                  onChange={(e) => handleChange(e, "fecha_inicio", "anio")}
                >
                  {generateOptions(2025, 2040).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Selector de Fecha Fin */}
          <div className="flex flex-row p-2 ml-5">
            <label className="block text-sm font-medium text-black dark:text-white p-2">
              Fecha Fin:
            </label>
            <div className="flex gap-2">
              <div className="flex-col flex text-center">
                <span className="text-black dark:text-white">Día</span>
                <select
                  className="border border-gray-300 rounded-md p-2"
                  value={fechasSelector.fecha_fin.dia}
                  onChange={(e) => handleChange(e, "fecha_fin", "dia")}
                >
                  {generateOptions(1, 31).map((num) => (
                    <option key={num} value={String(num).padStart(2, "0")}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-col flex text-center">
                <span className="text-black dark:text-white">Mes</span>
                <select
                  className="border border-gray-300 rounded-md p-2"
                  value={fechasSelector.fecha_fin.mes}
                  onChange={(e) => handleChange(e, "fecha_fin", "mes")}
                >
                  {generateOptions(1, 12).map((num) => (
                    <option key={num} value={String(num).padStart(2, "0")}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-col flex text-center">
                <span className="text-black dark:text-white">Año</span>
                <select
                  className="border border-gray-300 rounded-md p-2"
                  value={fechasSelector.fecha_fin.anio}
                  onChange={(e) => handleChange(e, "fecha_fin", "anio")}
                >
                  {generateOptions(2025, 2040).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="content-end">
              <button
                className="p-2 bg-blue-600 rounded-xl ml-6 flex"
                onClick={() => ObtenerLista()}
              >
                <span className="mx-4 font-bold text-white">Buscar</span>
                <MagnifyingGlassIcon className="h-7 w-7 mx-2 text-white hover:text-black " />
              </button>
            </div>
          </div>
        </div>
        <div className="rounded-3xl ">
          {Lista && Lista.length != 0 ? (
            <>
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
                        identificador,
                        nombre,
                        procedimiento,
                        habitacion,
                        fecha,
                        horas_minutos,
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
                          <td className={`${classes} w-24`}>
                            <p className="font-normal">{nombre}</p>
                          </td>
                          <td className={`${classes} w-24`}>
                            <p className="font-normal">{procedimiento}</p>
                          </td>

                          <td className={`${classes} w-24`}>
                            <p className="font-normal">{habitacion}</p>
                          </td>
                          <td className={classes}>
                            <p className="font-normal">{fecha}</p>
                          </td>

                          <td className={classes}>
                            <p className="font-normal">{horas_minutos}</p>
                          </td>

                          <td className={classes}>
                            <button
                              className="hover:bg-red-950 bg-red-800 w-auto h-10  text-center rounded-2xl items-center content-center"
                              onClick={() => ConfirmarEliminar(identificador)}
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
              <div className="flex justify-center mt-4">
                <button
                  className="bg-blue-900 text-white font-bold p-4 rounded-2xl"
                  onClick={() => generatePDF()}
                >
                  Descargar PDF
                </button>
              </div>
            </>
          ) : (
            <p className="font-bold text-center text-2xl text-slate-800 dark:text-white">
              No hay Resultados
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
