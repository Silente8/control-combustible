import { Fuel } from "lucide-react";
import { ZODI_ORGANIZATION, APP_TITLE } from "@/lib/branding";
import { cn } from "@/lib/utils";

interface AppBrandProps {
  estacionNombre?: string;
  variant?: "sidebar" | "compact" | "login" | "admin";
  className?: string;
}

export function AppBrand({
  estacionNombre,
  variant = "sidebar",
  className,
}: AppBrandProps) {
  if (variant === "compact") {
    return (
      <div className={cn("flex min-w-0 items-center gap-2.5", className)}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-sm">
          <Fuel className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-900">{APP_TITLE}</p>
          <p className="truncate text-xs text-blue-700">{ZODI_ORGANIZATION}</p>
          {estacionNombre && (
            <p className="truncate text-xs font-medium text-slate-600">
              Estación {estacionNombre}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (variant === "login") {
    return (
      <div className={cn("text-center", className)}>
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg">
            <Fuel className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          {APP_TITLE}
        </h1>
        <p className="mt-1 text-sm font-medium text-blue-700">{ZODI_ORGANIZATION}</p>
        {estacionNombre && (
          <p className="mt-2 inline-block rounded-full bg-slate-100 px-4 py-1 text-sm font-semibold text-slate-700">
            Estación {estacionNombre}
          </p>
        )}
      </div>
    );
  }

  if (variant === "admin") {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-800 shadow-sm">
          <Fuel className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold leading-tight text-slate-900 lg:text-lg">
            Panel Administrador
          </h1>
          <p className="text-xs text-indigo-700">{ZODI_ORGANIZATION}</p>
          <p className="text-xs text-slate-500">Todas las estaciones</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-sm">
        <Fuel className="h-5 w-5 text-white" />
      </div>
      <div>
        <h1 className="text-base font-bold leading-tight text-slate-900 lg:text-lg">
          {APP_TITLE}
        </h1>
        <p className="text-xs font-medium text-blue-700">{ZODI_ORGANIZATION}</p>
        {estacionNombre && (
          <p className="text-xs font-semibold text-slate-600">
            Estación {estacionNombre}
          </p>
        )}
      </div>
    </div>
  );
}
