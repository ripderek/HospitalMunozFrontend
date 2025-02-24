import { useEffect, useState } from "react";
import { MinusCircleIcon, PlayIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useApiContext } from "../../context/ApiContext";
import CryptoJS from "crypto-js";
import Cookies from "universal-cookie";
import Loader from "../../components/Layout/Loader";

export default function Factura({
  Lista,
  EliminarRow,
  ModificarCantidad,
  Limpiar,
  actualizarLista,
  ObtenerIDVenta,
}) {
  const [Total, SetTotales] = useState({
    Total: 0.0,
  });
  useEffect(() => {
    const sumaTotal = Lista.reduce(
      (acc, row) => acc + (parseFloat(row.total) || 0),
      0
    );

    // Actualizar el estado con el nuevo total
    SetTotales({ Total: parseFloat(sumaTotal.toFixed(2)) });
  }, [Lista]);
  const TABLE_HEAD = ["N", "Medicina", "Precio", "Cantidad", "Total", "Quitar"];
  //funcion para enviar la informacion
  const secretKey = "SECRET_KEY";
  const cookies = new Cookies();
  const param1 = cookies.get("param6") || "";
  const param1bytes = CryptoJS.AES.decrypt(param1, secretKey);
  const { apiUrl } = useApiContext();
  const [load, setLoader] = useState(false);

  const EnviarDatos = async () => {
    try {
      setLoader(true);

      const result = await axios.post(
        apiUrl + "ventas/Crear",
        {
          totalventa: Total.Total,
          iva: 0,
          descuento: 0,
          identificacion: param1bytes.toString(CryptoJS.enc.Utf8),
          Items: Lista,
        },
        {
          withCredentials: true,
        }
      );

      setLoader(false);
      //alert("ID Venta:" + result.data);
      ObtenerIDVenta(result.data);
      //Aqui generar la factura de la venta
      actualizarLista();
      Limpiar();
    } catch (error) {
      setLoader(false);
      alert("Error");
      console.log(error);
    }
  };
  return (
    <>
      {load && <Loader />}

      <div>
        {Lista && Lista.length != 0 ? (
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold dark:text-white">
              Total: ${Total.Total.toFixed(2)}
            </h2>
            <table className="w-full min-w-max table-auto text-left ">
              <thead>
                <tr className="border-b border-blue-gray-100  bg-blue-100 dark:bg-black/40 p-4">
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
                  ({ medicinaid, medicina, valor, cantidad, total }, index) => {
                    const isLast = index === Lista.length - 1;
                    const classes = isLast
                      ? "p-2"
                      : "p-2 border-b border-blue-gray-50";

                    return (
                      <tr
                        key={parseInt(index)}
                        className="text-black dark:text-white hover:dark:bg-slate-300  hover:dark:text-black hover:bg-blue-50 "
                      >
                        <td className={classes}>
                          <p className="font-normal">{index + 1}</p>
                        </td>
                        <td className={classes}>
                          <p className="font-normal">{medicina}</p>
                        </td>
                        <td className={classes}>
                          <p className="font-normal">
                            ${valor < 1 ? ` 0${valor.trim()}` : `${valor}`}
                          </p>
                        </td>
                        <td className={`${classes} text-center`}>
                          <input
                            type="number"
                            value={cantidad}
                            className="text-center w-20 text-black rounded-xl"
                            onChange={(e) =>
                              ModificarCantidad(
                                medicinaid,
                                e.target.value,
                                valor
                              )
                            }
                          />
                        </td>
                        <td className={classes}>
                          <p className="font-normal">{`$ ${total}`}</p>
                        </td>

                        <td className={classes}>
                          <button
                            className="hover:bg-red-950 bg-red-800 h-10 w-auto  text-center rounded-2xl items-center content-center"
                            onClick={() => EliminarRow(medicinaid)}
                          >
                            <MinusCircleIcon className="h-10 w-10 text-white  p-2" />
                          </button>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
            <button
              className="p-2 bg-blue-800 w-96 self-end text-center mt-6 rounded-2xl font-bold text-white text-xl flex content-center justify-center items-center"
              onClick={() => EnviarDatos()}
            >
              <PlayIcon className="h-10 w-10 text-white  p-2" />
              Registrar venta
            </button>
          </div>
        ) : (
          <p className="font-bold text-center text-2xl text-slate-800 dark:text-white">
            No hay productos en la factura
          </p>
        )}
      </div>
    </>
  );
}
