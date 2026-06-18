import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";
import { RotateHint } from "@/components/RotateHint";
import { requireOperador } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await requireOperador();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 lg:flex-row">
      <RotateHint />
      <TopNav userEmail={ctx.email} estacionNombre={ctx.estacionNombre} />
      <Sidebar userEmail={ctx.email} estacionNombre={ctx.estacionNombre} />
      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
