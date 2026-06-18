"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/nav-items";
import { AppBrand } from "@/components/AppBrand";
import { UserFooter } from "@/components/UserFooter";

export function TopNav({
  userEmail,
  estacionNombre,
}: {
  userEmail: string;
  estacionNombre: string;
}) {
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-200 bg-white lg:hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <AppBrand estacionNombre={estacionNombre} variant="compact" />
        <UserFooter email={userEmail} compact />
      </div>

      <nav className="flex gap-1.5 overflow-x-auto px-3 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors",
                active
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
