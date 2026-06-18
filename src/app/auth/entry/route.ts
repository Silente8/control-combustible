import { NextRequest, NextResponse } from "next/server";
import { getSessionContext } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const base = request.nextUrl.origin;

  try {
    const ctx = await getSessionContext();

    if (!ctx) {
      const supabase = await createClient();
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL("/login?error=sin-perfil", base));
    }

    const dest = ctx.rol === "admin" ? "/admin" : "/";
    return NextResponse.redirect(new URL(dest, base));
  } catch {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/login?error=db-error", base));
  }
}
