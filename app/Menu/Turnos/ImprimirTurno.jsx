import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { PrinterIcon } from "@heroicons/react/24/solid";
import { useApiContext } from "../../context/ApiContext";
import Loader from "../../components/Layout/Loader";

export default function ImprimirTurno({ turnoID, cerrar }) {
  const { apiUrl } = useApiContext();
  const [load, setLoader] = useState(false);
  const printRef = useRef(null);
  const FechaActual = new Date();
  //Objeto con la informacion para registrar del cupo
  const [Cupo, SetCupo] = useState([]);

  useEffect(() => {
    ObtenerInfo();
  }, [turnoID]);

  const ObtenerInfo = async () => {
    setLoader(true);
    try {
      const response = await fetch(apiUrl + "turno/verTurno/" + turnoID, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      SetCupo(data);
      //console.log(data);
      setLoader(false);
    } catch (error) {
      console.log(`Error: ${error}`);
      alert("Error en la peticion ObtenerInfo:imprimir turno");
      setLoader(false);
    }
  };

  /*
  const handleDownloadPdf = async () => {
    const element = printRef.current;
    if (!element) {
      return;
    }
    const canvas = await html2canvas(element, {
      scale: 2,
    });
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a7",
    });

    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();

    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("examplepdf.pdf");
  }; */

  //funcion para imprimir en lugar de descargar
  const handlePrint = async () => {
    const element = printRef.current;
    if (!element) {
      return;
    }

    const canvas = await html2canvas(element, { scale: 2 });
    const image = canvas.toDataURL("image/png");

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Imprimir Turno</title>
          <style>
            @media print {
              body {
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
              }
              img {
                width: 100vw;
                height: 100vh;
                object-fit: contain;
                page-break-inside: avoid;
              }
            }
            body {
              margin: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
            }
            img {
              width: 100vw;
              height: 100vh;
              object-fit: contain;
            }
          </style>
        </head>
        <body>
          <img src="${image}" />
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50 ">
      <div className="w-max">
        <div className="bg-white dark:bg-gray-950 p-3  rounded-3xl animate-fade-in">
          <div className=" h-full w-full">
            {load && <Loader />}
            <div className="flex flex-col">
              <button
                className="p-3 bg-blue-600 rounded-3xl font-semibold text-white self-end"
                onClick={cerrar}
              >
                X
              </button>
            </div>

            <div>
              <div
                ref={printRef}
                className="w-96 h-96  rounded-2xl p-4 bg-white  gap-3  flex flex-col text-black"
              >
                <div className="text-center mt-4">Logo</div>
                <div className="mt-6">
                  <span className="font-bold">Fecha:</span>
                  {Cupo.fechar ? Cupo.fechar : ""}
                  <span className="font-bold ml-3">Hora:</span>{" "}
                  {Cupo.hora_minutosr ? Cupo.hora_minutosr : ""}
                </div>
                <div className="text-center ">
                  <h1 className="text-2xl">TURNO</h1>
                  <h1 className="text-3xl font-bold mt-2 ">
                    {Cupo.departamentor ? Cupo.departamentor : "DEPARTAMENTO"}
                  </h1>
                </div>
                <div className="mt-6 flex flex-col">
                  <p className="text-center text-lg">
                    {Cupo.pacienter ? Cupo.pacienter : "PACIENTE"}
                  </p>
                  <div className="flex flex-row  gap-3 justify-center">
                    <p className="text-center text-lg font-bold">
                      {" "}
                      {Cupo.valorr ? `$${Cupo.valorr}` : "$ Valor"}
                    </p>
                    <p className="text-center text-lg">
                      {" "}
                      {Cupo.metodopagor ? Cupo.metodopagor : "Tipo pago"}
                    </p>
                  </div>
                  <span className="self-end mt-2">
                    {Cupo.identificadorr ? Cupo.identificadorr : ""}
                  </span>
                </div>
              </div>
            </div>
            <button
              className="p-2 bg-blue-800 w-full text-center mt-6 rounded-2xl font-bold text-white text-xl flex content-center justify-center items-center"
              onClick={handlePrint}
            >
              <PrinterIcon className="h-10 w-10 text-white  p-2" />
              Imprimir turno
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
