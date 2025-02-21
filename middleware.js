import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const jwt = request.cookies.get("myTokenName")?.value; // Obtén la cookie

  if (!jwt) {
    return NextResponse.redirect(new URL("/Login", request.url)); // Redirige si no hay token
  }

  try {
    const { payload } = await jwtVerify(
      jwt,
      new TextEncoder().encode("SECRET")
    );
    //console.log("Token válido:", payload);
    return NextResponse.next(); // Continúa si el token es válido
  } catch (error) {
    console.error("Token inválido:", error);
    return NextResponse.redirect(new URL("/", request.url)); // Redirige si es inválido
  }
}

export const config = {
  matcher: ["/Menu/:path*"], // Rutas protegidas
};
