import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ApiProvider } from "./context/ApiContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Proyecto Clinica",
  description: "Aplicacion Web para clinica",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ApiProvider> {children}</ApiProvider>
      </body>
    </html>
  );
}
