import Image from "next/image";
export default function Footer() {
  const currentYear = new Date().getFullYear(); // Obtener el año actual
  const aClassnme =
    "font-normal transition-colors hover:text-blue-500 focus:text-blue-500 text-white";
  return (
    <footer className="w-full p-8 mt-8 bg-gray-800">
      <div className="flex flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 text-center md:justify-between">
        <Image
          //className="dark:invert"
          src="/Extintor_logo7.png"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
          <li>
            <a as="a" href="#" color="blue-gray" className={`${aClassnme}`}>
              Acerca de
            </a>
          </li>
          <li>
            <a as="a" href="#" color="blue-gray" className={`${aClassnme}`}>
              Licencia
            </a>
          </li>

          <li>
            <a as="a" href="#" color="blue-gray" className={`${aClassnme}`}>
              Contactar
            </a>
          </li>
        </ul>
      </div>
      <hr className="my-8 border-blue-gray-50" />
      <p className="text-center font-normal text-white">
        &copy; {currentYear} Extintor Team
      </p>
    </footer>
  );
}
