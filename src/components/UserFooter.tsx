"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";

interface UserFooterProps {
  email: string;
}

export function UserFooter({ email }: UserFooterProps) {
  const router = useRouter();
  const label = email.split("@")[0];

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="border-t border-slate-200 p-4">
      <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
            {label.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">{label}</p>
            <p className="text-xs text-slate-500">Operador</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          title="Cerrar sesión"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
