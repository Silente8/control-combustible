import { Sidebar } from "@/components/Sidebar";
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
    <div className="flex min-h-screen">
      <Sidebar userEmail={user.email} />
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
