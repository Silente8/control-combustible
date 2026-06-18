import { cn, formatLitros } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  subtitle?: string;
  variant?: "gasolina" | "gasoleo" | "entrada" | "despacho" | "default";
}

const variants = {
  gasolina: "border-l-4 border-l-gasolina bg-gasolina-light/30",
  gasoleo: "border-l-4 border-l-gasoleo bg-gasoleo-light/50",
  entrada: "border-l-4 border-l-entrada bg-entrada-light/30",
  despacho: "border-l-4 border-l-despacho bg-despacho-light/30",
  default: "border-l-4 border-l-slate-400",
};

export function StatCard({ title, value, subtitle, variant = "default" }: StatCardProps) {
  return (
    <div className={cn("card", variants[variant])}>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{formatLitros(value)}</p>
      {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
    </div>
  );
}
