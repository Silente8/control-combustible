import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { es } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatLitros(litros: number): string {
  return `${litros.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} L`;
}

export function formatFecha(fecha: string): string {
  try {
    return format(parseISO(fecha.length <= 10 ? fecha : fecha.split("T")[0]), "dd/MM/yyyy", { locale: es });
  } catch {
    return fecha;
  }
}

export function formatFechaHora(fechaHora: string): string {
  try {
    return format(parseISO(fechaHora), "dd/MM/yyyy HH:mm", { locale: es });
  } catch {
    return fechaHora;
  }
}

export type Periodo = "hoy" | "semana" | "mes" | "todo";

export function getRangoPeriodo(periodo: Periodo): { desde: string; hasta: string } | null {
  const now = new Date();
  if (periodo === "todo") return null;

  let desde: Date;
  let hasta: Date;

  switch (periodo) {
    case "hoy":
      desde = startOfDay(now);
      hasta = endOfDay(now);
      break;
    case "semana":
      desde = startOfWeek(now, { weekStartsOn: 1 });
      hasta = endOfWeek(now, { weekStartsOn: 1 });
      break;
    case "mes":
      desde = startOfMonth(now);
      hasta = endOfMonth(now);
      break;
  }

  return {
    desde: format(desde, "yyyy-MM-dd"),
    hasta: format(hasta, "yyyy-MM-dd"),
  };
}

export function hoyISO(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function ahoraISO(): string {
  return new Date().toISOString();
}
