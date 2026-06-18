import { formatLitros } from "@/lib/utils";
import { Building2 } from "lucide-react";

interface EstacionSummaryCardProps {
  nombre: string;
  totalEntradas: number;
  totalDespachos: number;
  gasolina: number;
  gasoil: number;
}

export function EstacionSummaryCard({
  nombre,
  totalEntradas,
  totalDespachos,
  gasolina,
  gasoil,
}: EstacionSummaryCardProps) {
  return (
    <div className="card border-t-4 border-t-blue-600 p-5">
      <div className="mb-4 flex items-center gap-2">
        <Building2 className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-bold text-slate-900">{nombre}</h3>
      </div>
      <div className="grid grid-cols-2 gap-3 landscape:grid-cols-4">
        <div className="rounded-lg bg-green-50 p-3">
          <p className="text-xs font-medium text-green-700">Entradas (mes)</p>
          <p className="mt-1 text-lg font-bold text-green-900">
            {formatLitros(totalEntradas)}
          </p>
        </div>
        <div className="rounded-lg bg-orange-50 p-3">
          <p className="text-xs font-medium text-orange-700">Despachos (mes)</p>
          <p className="mt-1 text-lg font-bold text-orange-900">
            {formatLitros(totalDespachos)}
          </p>
        </div>
        <div className="rounded-lg bg-blue-50 p-3">
          <p className="text-xs font-medium text-blue-700">Gasolina</p>
          <p className="mt-1 text-lg font-bold text-blue-900">{formatLitros(gasolina)}</p>
        </div>
        <div className="rounded-lg bg-slate-100 p-3">
          <p className="text-xs font-medium text-slate-700">Gasoil</p>
          <p className="mt-1 text-lg font-bold text-slate-900">{formatLitros(gasoil)}</p>
        </div>
      </div>
    </div>
  );
}
