import MenuLateral from "../components/Menu/MenuLateral";
import "../globals.css";

export const metadata = {
  title: "Menu Sistema",
  description: "Aplicacion Web para clinica",
};

export default function RootLayout({ children }) {
  return (
    <div className="flex flex-row">
      <div>
        <MenuLateral />
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
