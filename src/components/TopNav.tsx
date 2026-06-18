"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fuel } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/nav-items";
import { UserFooter } from "@/components/UserFooter";

export function TopNav({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-200 bg-white lg:hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <Fuel className="h-6 w-6 shrink-0 text-blue-600" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900">
              Control Combustible ZODI
            </p>
            <p className="truncate text-xs text-slate-500">Estación Las Delicias</p>
          </div>
        </div>
        <UserFooter email={userEmail} compact />
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                active
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
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
