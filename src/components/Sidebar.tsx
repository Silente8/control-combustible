"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/nav-items";
import { AppBrand } from "@/components/AppBrand";
import { UserFooter } from "@/components/UserFooter";

export function Sidebar({
  userEmail,
  estacionNombre,
}: {
  userEmail: string;
  estacionNombre: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="border-b border-slate-200 px-5 py-5">
        <AppBrand estacionNombre={estacionNombre} />
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                active
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Icon className="h-5 w-5" />
              {label === "Panel" ? "Panel de Control" : label}
            </Link>
          );
        })}
      </nav>

      <UserFooter email={userEmail} />
    </aside>
  );
}
