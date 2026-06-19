"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, History, BarChart3, Fuel } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppBrand } from "@/components/AppBrand";
import { UserFooter } from "@/components/UserFooter";

const adminNav = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard, exact: true },
  { href: "/admin/despachos", label: "Despachos", icon: Fuel, exact: false },
  { href: "/admin/historial", label: "Historial", icon: History, exact: true },
  { href: "/admin/reportes", label: "Reportes", icon: BarChart3, exact: true },
];

function isActive(pathname: string, href: string, exact: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden w-72 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="border-b border-slate-200 px-5 py-5">
          <AppBrand variant="admin" />
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {adminNav.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(pathname, href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                  active
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            );
          })}
        </nav>
        <UserFooter email={userEmail} />
      </aside>

      <header className="border-b border-slate-200 bg-white lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <AppBrand variant="admin" />
          <UserFooter email={userEmail} compact />
        </div>
        <nav className="flex gap-1.5 overflow-x-auto px-3 pb-3">
          {adminNav.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(pathname, href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold",
                  active ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-600"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </header>
    </>
  );
}
