// context/ApiContext.js
"use client";

import { createContext, useContext } from "react";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const apiUrl = "http://192.168.1.22:4099/"; // Direccion de la API
  function obtenerFechaFormato() {
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0"); // +1 porque los meses van de 0 a 11
    const anio = fecha.getFullYear(); // Año en 4 dígitos

    return `${dia}${mes}${anio}`;
  }
  return (
    <ApiContext.Provider value={{ apiUrl, obtenerFechaFormato }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApiContext = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApiContext debe usarse dentro de un ApiProvider");
  }
  return context;
};
