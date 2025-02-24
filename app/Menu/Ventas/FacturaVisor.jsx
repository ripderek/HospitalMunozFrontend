import { useState, useEffect } from "react";
import { useApiContext } from "../../context/ApiContext";
import axios from "axios";
import Loader from "../../components/Layout/Loader";
import { PrinterIcon } from "@heroicons/react/24/solid";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
export default function FacturaVisor({ cerrar, ventaid }) {
  const [Detalle, SetDetalle] = useState([]);
  const [load, setLoader] = useState(false);
  const { apiUrl } = useApiContext();

  useEffect(() => {
    ObtenerLista();
  }, []);

  const ObtenerLista = async () => {
    setLoader(true);
    try {
      const result = await axios.post(
        apiUrl + "ventas/DetalleVenta",
        {
          ventaid: ventaid,
        },
        {
          withCredentials: true,
        }
      );
      console.log(result.data);
      SetDetalle(result.data.obtener_factura_id_venta);
      //console.log(data);
      setLoader(false);
    } catch (error) {
      console.log(`Error: ${error}`);
      alert("Error en la peticion ventas/DetalleVenta");
      setLoader(false);
    }
  };
  const TABLE_HEAD = ["N", "Medicina", "Precio", "Cantidad", "Subtotal"];
  const generatePDF = () => {
    const doc = new jsPDF();

    // Configuración inicial
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);

    // ENCABEZADO
    doc.text(`Hora: ${Detalle.hora_minutos}`, 10, 10);
    doc.text(`Fecha: ${Detalle.fecha_formateada}`, 150, 10);
    doc.text(`Vendedor: ${Detalle.apellidos} ${Detalle.nombres}`, 10, 20);
    doc.text(`Total: $${Detalle.TotalVenta.trim()}`, 150, 20);

    // Espaciado para la tabla
    doc.setFont("helvetica", "normal");
    doc.text("Detalle de la venta", 10, 35);

    // TABLA
    const columns = ["#", "Medicina", "Precio", "Cantidad", "Subtotal"];
    const rows = Detalle.items.map(({ cantidad, medicina, precio }, index) => [
      index + 1,
      medicina,
      `$${precio.trim()}`,
      cantidad,
      `$${(parseFloat(precio.trim()) * cantidad).toFixed(2)}`,
    ]);

    doc.autoTable({
      startY: 40, // Posición inicial de la tabla
      head: [columns],
      body: rows,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 102, 204] }, // Azul para el encabezado
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 60 },
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { cellWidth: 30 },
      },
      margin: { top: 10 },
    });
    // Descargar el PDF
    let nombrePdf = `Venta-${Detalle.fechaFormart}.pdf`;
    doc.save(nombrePdf);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50 ">
      <div className="w-[100vh] ">
        <div className="bg-white dark:bg-gray-950 p-3  rounded-3xl animate-fade-in">
          {load && <Loader />}
          <div className=" h-full w-full flex flex-col p-4">
            <div className="flex flex-row">
              <h1 className=" flex-1 text-3xl font-semibold text-blue-800 dark:text-white">
                Venta
              </h1>
              <button
                className="p-3 bg-blue-600 rounded-3xl font-semibold text-white self-end"
                onClick={cerrar}
              >
                X
              </button>
            </div>
            {/* AQUI ES EL CUERPO DE LA FACTURA */}
            <div className="bg-white h-full w-full text-black mt-1 rounded-lg">
              {/* ENCABEZADO */}
              <div className="p-4 flex flex-col gap-3">
                <div className="flex flex-row ">
                  <h1 className="flex-1 ">
                    <span className="font-bold">{`Hora: `}</span>
                    {Detalle.hora_minutos}
                  </h1>
                  <h1>{Detalle.fecha_formateada}</h1>
                </div>
                <div className="flex flex-row ">
                  <h1 className="flex-1 ">
                    <span className="font-bold">{`Vendedor: `}</span>
                    {`${Detalle.apellidos} ${Detalle.nombres}`}{" "}
                  </h1>
                  <h1>
                    <span className="font-bold">{`Total: `}</span>
                    {`    ${
                      Detalle.TotalVenta < 1
                        ? ` 0${Detalle.TotalVenta.trim()}`
                        : `${Detalle.TotalVenta}`
                    }`}
                  </h1>
                </div>
                {/*ITEMS */}
                <div className="h-[45vh] overflow-y-scroll">
                  {Detalle.items && Detalle.items.length != 0 ? (
                    <table className="w-full h-auto min-w-max table-auto text-left bg-white border border-gray-300">
                      <thead>
                        <tr className="bg-white border border-gray-300">
                          {TABLE_HEAD.map((head) => (
                            <th
                              key={head}
                              className="p-4 border border-gray-300"
                            >
                              <h1 className="font-semibold text-black leading-none text-sm">
                                {head}
                              </h1>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Detalle.items.map(
                          ({ cantidad, medicina, precio }, index) => (
                            <tr
                              key={index}
                              className="text-black hover:bg-gray-200 border border-gray-300 text-sm"
                            >
                              <td className="p-2 border border-gray-300">
                                <p className="font-normal">{index}</p>
                              </td>
                              <td className="p-2 border border-gray-300">
                                <p className="font-normal">{medicina}</p>
                              </td>
                              <td className="p-2 border border-gray-300">
                                <p className="font-normal">{`$${precio}`}</p>
                              </td>
                              <td className="p-2 border border-gray-300">
                                <p className="font-normal">{cantidad}</p>
                              </td>{" "}
                              <td className="p-2 border border-gray-300">
                                <p className="font-normal">{`$${(
                                  parseFloat(precio.trim()) * cantidad
                                ).toFixed(2)}`}</p>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  ) : (
                    <p className="font-bold text-center text-2xl text-slate-800 dark:text-white">
                      No hay resultados
                    </p>
                  )}
                </div>
                <button
                  className="p-2 bg-blue-800 w-full text-center mt-6 rounded-2xl font-bold text-white text-xl flex content-center justify-center items-center"
                  onClick={() => generatePDF()}
                >
                  <PrinterIcon className="h-10 w-10 text-white  p-2" />
                  Descargar PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
