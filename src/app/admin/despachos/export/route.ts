import { NextRequest, NextResponse } from "next/server";
import { getAdminDespachosDetalle } from "@/lib/admin-actions";
import { toCsv } from "@/lib/csv";
import { formatFechaHora } from "@/lib/utils";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  await requireAdmin();

  const sp = request.nextUrl.searchParams;
  const estacionId = sp.get("estacion") ? Number(sp.get("estacion")) : undefined;
  const productoId = sp.get("producto") ? Number(sp.get("producto")) : undefined;
  const tipo = sp.get("tipo") as "persona" | "institucion" | null;

  const rows = await getAdminDespachosDetalle({
    estacionId: estacionId || undefined,
    desde: sp.get("desde") || undefined,
    hasta: sp.get("hasta") || undefined,
    productoId: productoId || undefined,
    tipoBeneficiario: tipo || undefined,
  });

  const csv = toCsv(
    [
      "Fecha",
      "Estación",
      "Producto",
      "Litros",
      "Tipo",
      "Beneficiario",
      "Operador",
      "Observaciones",
    ],
    rows.map((r) => [
      formatFechaHora(r.fechaHora),
      r.estacion,
      r.producto,
      r.litros,
      r.tipoBeneficiario,
      r.beneficiario,
      r.operador,
      r.observaciones,
    ])
  );

  const fecha = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="despachos-${fecha}.csv"`,
    },
  });
}
