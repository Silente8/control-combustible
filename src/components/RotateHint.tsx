"use client";

import { Smartphone } from "lucide-react";

export function RotateHint() {
  return (
    <div className="flex items-center justify-center gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-900 lg:hidden portrait:flex landscape:hidden">
      <Smartphone className="h-4 w-4 shrink-0 rotate-90" />
      <span>Gire el dispositivo en horizontal para una mejor vista</span>
    </div>
  );
}
