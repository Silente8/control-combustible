import { NextRequest, NextResponse } from "next/server";
import { getSessionContext } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const ctx = await getSessionContext();
  const base = request.nextUrl.origin;

  if (!ctx) {
    return NextResponse.redirect(new URL("/login?error=sin-perfil", base));
  }

  const dest = ctx.rol === "admin" ? "/admin" : "/";
  return NextResponse.redirect(new URL(dest, base));
}
