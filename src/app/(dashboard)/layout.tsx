import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";
import { RotateHint } from "@/components/RotateHint";
import { getCurrentUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user?.email) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <RotateHint />
      <TopNav userEmail={user.email} />
      <Sidebar userEmail={user.email} />
      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
