"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowDownToLine,
  ArrowUpFromLine,
  Building2,
  Users,
  History,
  BarChart3,
  Fuel,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserFooter } from "@/components/UserFooter";

const navItems = [
  { href: "/", label: "Panel de Control", icon: LayoutDashboard },
  { href: "/entradas", label: "Entradas", icon: ArrowDownToLine },
  { href: "/despachos", label: "Despachos", icon: ArrowUpFromLine },
  { href: "/instituciones", label: "Instituciones", icon: Building2 },
  { href: "/personas", label: "Personas", icon: Users },
  { href: "/historial", label: "Historial", icon: History },
  { href: "/reportes", label: "Reportes", icon: BarChart3 },
];

export function Sidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-2 border-b border-slate-200 px-6 py-5">
        <Fuel className="h-7 w-7 shrink-0 text-blue-600" />
        <div>
          <h1 className="text-lg font-bold leading-tight text-slate-900">
            Control Combustible ZODI YARACUY
          </h1>
          <p className="text-xs text-slate-500">Estación Las Delicias</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
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
  );
}
