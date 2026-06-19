import Link from "next/link";
import { formatLitros } from "@/lib/utils";
import { Building2, FileText } from "lucide-react";

interface EstacionSummaryCardProps {
  estacionId: number;
  nombre: string;
  totalEntradas: number;
  totalDespachos: number;
  gasolina: number;
  gasoil: number;
}

export function EstacionSummaryCard({
  estacionId,
  nombre,
  totalEntradas,
  totalDespachos,
  gasolina,
  gasoil,
}: EstacionSummaryCardProps) {
  return (
    <div className="card border-t-4 border-t-blue-600 p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-bold text-slate-900">{nombre}</h3>
        </div>
        <Link
          href={`/admin/despachos?estacion=${estacionId}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
        >
          <FileText className="h-3.5 w-3.5" />
          Ver despachos
        </Link>
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
