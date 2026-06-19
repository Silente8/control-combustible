import { getDb } from "@/db";
import { estaciones, perfilesUsuario } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getCurrentUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type UserRole = "operador" | "admin";

export interface SessionContext {
  userId: string;
  email: string;
  rol: UserRole;
  estacionId: number | null;
  estacionNombre: string | null;
}

export async function getSessionContext(): Promise<SessionContext | null> {
  const user = await getCurrentUser();
  if (!user?.email) return null;

  const db = await getDb();
  const [row] = await db
    .select({
      rol: perfilesUsuario.rol,
      estacionId: perfilesUsuario.estacionId,
      estacionNombre: estaciones.nombre,
    })
    .from(perfilesUsuario)
    .leftJoin(estaciones, eq(perfilesUsuario.estacionId, estaciones.id))
    .where(sql`lower(${perfilesUsuario.email}) = lower(${user.email})`)
    .limit(1);

  if (!row) return null;

  return {
    userId: user.id,
    email: user.email,
    rol: row.rol as UserRole,
    estacionId: row.estacionId,
    estacionNombre: row.estacionNombre,
  };
}

export async function requireOperador(): Promise<
  SessionContext & { estacionId: number; estacionNombre: string }
> {
  const ctx = await getSessionContext();
  if (!ctx) redirect("/login?error=sin-perfil");
  if (ctx.rol === "admin") redirect("/admin");
  if (!ctx.estacionId || !ctx.estacionNombre) redirect("/login?error=sin-estacion");
  return ctx as SessionContext & { estacionId: number; estacionNombre: string };
}

export async function requireAdmin(): Promise<SessionContext> {
  const ctx = await getSessionContext();
  if (!ctx) redirect("/login?error=sin-perfil");
  if (ctx.rol !== "admin") redirect("/");
  return ctx;
}
