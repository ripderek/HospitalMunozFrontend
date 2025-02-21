import axios from "axios";
import { useApiContext } from "../../context/ApiContext";
import Loader from "@/app/components/Layout/Loader";
import CryptoJS from "crypto-js";
import Cookies from "universal-cookie";
import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
export default function ArchivoCierreTurno() {
  const { apiUrl, obtenerFechaFormato } = useApiContext();
  const secretKey = "SECRET_KEY";
  const cookies = new Cookies();
  const param1 = cookies.get("param8") || "";
  const param1bytes = CryptoJS.AES.decrypt(param1, secretKey);
  const [load, setLoader] = useState(false);
  const [info, setInfo] = useState([]);
  const [resultados, SetResultados] = useState({
    Ingresos: 0,
    Egresos: 0,
    Total: 0,
  });
  const [personal, setPersonal] = useState([]);

  useEffect(() => {
    ObtenerInformacion();
  }, []);
  //para calcular los resultados:
  useEffect(() => {
    // Calcular suma de ingresos y egresos
    const ingresos = info.reduce(
      (acc, item) => acc + parseFloat(item.ingreso || 0),
      0
    );
    const egresos = info.reduce(
      (acc, item) => acc + parseFloat(item.egreso || 0),
      0
    );
    const total = ingresos - egresos;

    // Actualizar el estado con los valores calculados
    SetResultados({
      Ingresos: ingresos.toFixed(2),
      Egresos: egresos.toFixed(2),
      Total: total.toFixed(2),
    });
  }, [info]); // Se ejecuta cada vez que cambia "info"

  const ObtenerInformacion = async () => {
    try {
      setLoader(true);

      const result = await axios.post(
        apiUrl + "turno/listarResultadosCierreTurnoUsuarioFecha",
        {
          userid: parseInt(param1bytes.toString(CryptoJS.enc.Utf8)),
          fecha: obtenerFechaFormato(),
        },
        {
          withCredentials: true,
        }
      );
      setInfo(result.data);
      //obtener el personal
      const result2 = await axios.post(
        apiUrl + "turno/fu_lista_personal_cierre",
        {
          userid: parseInt(param1bytes.toString(CryptoJS.enc.Utf8)),
          fecha: obtenerFechaFormato(),
        },
        {
          withCredentials: true,
        }
      );
      setPersonal(result2.data);
      setLoader(false);
      // setturnoID(result.data);
    } catch (error) {
      setLoader(false);
      alert("Error");
      console.log(error);
    }
  };
  const TABLE_HEAD = ["Tipo", "Descripcion", "Ingreso", "Egreso"];
  // Función para exportar a PDF
  const exportToPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    // Agregar título
    doc.setFontSize(18);
    //doc.text(`Archivo Cierre Caja ${personal[0].persona}`, 14, 22);
    doc.text(`Archivo Cierre Caja`, 14, 22);

    // Agregar tabla de autores (mini tabla)
    // const autoresColumn = ["Personal"];
    const autoresRows = personal.map(({ persona }) => [persona]);

    doc.setFontSize(12);
    //doc.text("Autores", 14, 30);
    doc.autoTable({
      startY: 30, // Empieza la tabla después del título de autores
      //  head: [autoresColumn],
      body: autoresRows,
      theme: "grid",
      margin: { top: 10, bottom: 10 },
      columnStyles: {
        0: { halign: "left" }, // Autor
      },
    });

    // Agregar tabla principal (Archivo de Cierre Turno)
    const tableColumn = ["Tipo", "Descripcion", "Ingreso", "Egreso"];
    const tableRows = info.map(({ tipo, descripcion, ingreso, egreso }) => [
      tipo,
      descripcion,
      ingreso == 0 ? "-" : `$ ${ingreso}`,
      egreso == 0 ? "-" : `$ ${egreso}`,
    ]);

    // Agregar tabla de datos
    doc.setFontSize(12);
    doc.text("Detalles del Turno", 14, doc.lastAutoTable.finalY + 10); // Después de la tabla de autores
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 15, // Empieza la tabla después de los autores
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      margin: { top: 10, bottom: 10 },
      columnStyles: {
        0: { halign: "left" }, // Tipo
        1: { halign: "left" }, // Descripcion
        2: { halign: "right" }, // Ingreso
        3: { halign: "right" }, // Egreso
      },
    });

    // Agregar fila de resultados
    const y = doc.lastAutoTable.finalY + 10; // Obtener la posición después de la tabla

    doc.setFontSize(12);
    doc.text("Subtotal:", 70, y);
    doc.text(`$ ${resultados.Ingresos}`, 140, y);
    doc.text(`$ ${resultados.Egresos}`, 175, y);

    // Agregar fila de Total
    const yTotal = y + 10;
    doc.text("Total:", 70, yTotal);
    doc.text(`$ ${resultados.Total}`, 160, yTotal);

    let nombreArchivo = `CierreCaja-${obtenerFechaFormato()}.pdf`;

    // Guardar PDF
    doc.save(nombreArchivo);
  };
  return (
    <>
      {load && <Loader />}

      <div className="p-4 gap-2">
        <div className="text-center items-center justify-center content-center bg-white  w-full rounded-2xl p-10  flex flex-col gap-6 ">
          <h1 className="text-black"> ArchivoCierreTurno</h1>

          <button
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
            onClick={exportToPDF}
          >
            Descargar como PDF
          </button>
          {/* RECORRER LA LISTA EN FORMA DE TABLA PARA MOSTRAR LA INFORMACION DEL TURNO */}
          {info && info.length != 0 ? (
            <table className="w-full min-w-max table-auto text-left bg-white border border-gray-300">
              <thead>
                <tr className="bg-white border border-gray-300">
                  {TABLE_HEAD.map((head) => (
                    <th key={head} className="p-4 border border-gray-300">
                      <h1 className="font-semibold text-black leading-none text-sm">
                        {head}
                      </h1>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {info.map(({ tipo, descripcion, ingreso, egreso }, index) => (
                  <tr
                    key={index}
                    className="text-black hover:bg-gray-200 border border-gray-300 text-sm"
                  >
                    <td className="p-2 border border-gray-300">
                      <p className="font-normal">{tipo}</p>
                    </td>
                    <td className="p-2 border border-gray-300">
                      <p className="font-normal">{descripcion}</p>
                    </td>
                    <td className="p-2 border border-gray-300">
                      <p className="font-normal flex justify-between w-full">
                        <span>$</span>
                        <span>{ingreso == 0 ? "-" : ingreso}</span>
                      </p>
                    </td>
                    <td className="p-2 border border-gray-300">
                      <p className="font-normal flex justify-between w-full">
                        <span>$</span>
                        <span>{egreso == 0 ? "-" : egreso}</span>
                      </p>
                    </td>
                  </tr>
                ))}
                {/* Fila de Resultados */}
                <tr className="bg-gray-100 font-semibold border border-gray-300 text-sm">
                  <td
                    className="p-2 border border-gray-300 text-center text-black font-bold"
                    colSpan={2}
                  >
                    Subtotal:
                  </td>
                  <td className="p-2 border border-gray-300 text-black bg-green-300">
                    <p className="font-bold flex justify-between w-full">
                      <span>$</span>
                      <span>{resultados.Ingresos}</span>
                    </p>
                  </td>
                  <td className="p-2 border border-gray-300 text-black bg-red-300">
                    <p className="font-bold flex justify-between w-full">
                      <span>$</span>
                      <span>{resultados.Egresos}</span>
                    </p>
                  </td>
                </tr>
                <tr className="bg-gray-100 font-semibold border border-gray-300 text-sm">
                  <td
                    className="p-2 border border-gray-300 text-center text-black font-bold"
                    colSpan={2}
                  >
                    Total:
                  </td>
                  <td
                    className={`p-2 border border-gray-300 text-black text-center ${
                      resultados.Total < 0 ? "bg-red-300" : "bg-green-300"
                    }`}
                    colSpan={2}
                  >
                    <p className="font-bold flex justify-between w-full">
                      <span>$</span>
                      <span>{resultados.Total}</span>
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p className="font-bold text-center text-2xl text-slate-800 dark:text-white">
              No hay resultados
            </p>
          )}
          {/*Resultado */}
          {resultados.Ingresos}
        </div>
      </div>
    </>
  );
}
