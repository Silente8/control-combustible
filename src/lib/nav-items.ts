import {
  LayoutDashboard,
  ArrowDownToLine,
  ArrowUpFromLine,
  Building2,
  Users,
  History,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

export const navItems: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Panel", icon: LayoutDashboard },
  { href: "/entradas", label: "Entradas", icon: ArrowDownToLine },
  { href: "/despachos", label: "Despachos", icon: ArrowUpFromLine },
  { href: "/instituciones", label: "Instituciones", icon: Building2 },
  { href: "/personas", label: "Personas", icon: Users },
  { href: "/historial", label: "Historial", icon: History },
  { href: "/reportes", label: "Reportes", icon: BarChart3 },
];
