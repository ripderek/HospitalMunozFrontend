import ArchivoCierreTurno from "./ArchivoCierreTurno";
export default function VerArchivo() {
  //hacer una funcion de prueba que genere el archivo con el diario del usuario
  return (
    <>
      <div className="p-4 gap-2">
        <div className="text-center items-center justify-center content-center bg-blue-100 dark:bg-black/40  w-full rounded-2xl p-10  flex flex-col gap-6 ">
          <ArchivoCierreTurno />
        </div>
      </div>
    </>
  );
}
