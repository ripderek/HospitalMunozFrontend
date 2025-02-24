import { useState } from "react";
import ListaMedicinas from "./ListaMedicinas";
import Factura from "./Factura";

export default function CrearVenta({ actualizarLista, ObtenerIDVenta }) {
  const [Lista, SetLista] = useState([]);
  const RetornarRow = (row) => {
    SetLista((prevLista) => {
      // Verificar si la fila ya existe en la lista comparando el `medicinaid`
      const existe = prevLista.some(
        (item) => item.medicinaid === row.medicinaid
      );

      // Si ya está en la lista, no hacer nada
      if (existe) {
        // alert(`El producto: ${row.medicina}, ya se encuentra en la factura`);
        return prevLista;
      }

      // Si no está en la lista, agregarla con cantidad y total inicializados
      const newRow = {
        ...row,
        cantidad: 1,
        total: parseFloat(row.valor).toFixed(2), // Asegurar 2 decimales
      };

      return [...prevLista, newRow];
    });
  };

  //funcion para quitar fila por el id skere modo diablo
  const EliminarRow = (id) => {
    SetLista((prevLista) => prevLista.filter((row) => row.medicinaid !== id));
  };
  const ModificarCantidad = (id, nuevaCantidad, valor) => {
    // Validar que la cantidad sea un número mayor o igual a 1
    const cantidadValida = Math.max(1, parseInt(nuevaCantidad) || 1);

    SetLista((prevLista) =>
      prevLista.map((row) =>
        row.medicinaid === id
          ? {
              ...row,
              cantidad: cantidadValida,
              total: (parseFloat(valor) * cantidadValida).toFixed(2),
            }
          : row
      )
    );
  };
  const Limpiar = () => {
    SetLista([]);
  };
  return (
    <>
      <div className="p-4 gap-2">
        <div
          id="form"
          className="bg-blue-100 dark:bg-black/40  w-full rounded-2xl p-10  flex flex-row gap-6 "
        >
          <div className=" w-[80vh]">
            <ListaMedicinas RetornarRow={RetornarRow} />
          </div>

          <div className="w-full  rounded-2xl p-5 bg-white dark:bg-slate-950/30 gap-3  flex flex-col ">
            <Factura
              Lista={Lista}
              EliminarRow={EliminarRow}
              ModificarCantidad={ModificarCantidad}
              Limpiar={Limpiar}
              actualizarLista={actualizarLista}
              ObtenerIDVenta={ObtenerIDVenta}
            />
          </div>
        </div>
      </div>
    </>
  );
}
