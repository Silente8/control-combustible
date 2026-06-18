import { AdminNav } from "@/components/AdminNav";
import { RotateHint } from "@/components/RotateHint";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 lg:flex-row">
      <RotateHint />
      <AdminNav userEmail={ctx.email} />
      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
