import Link from "next/link";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
    variant?: "primary" | "success" | "warning";
  };
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  const btnClass = {
    primary: "btn-primary",
    success: "btn-success",
    warning: "btn-warning",
  };

  return (
    <div className="mb-6 flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className={cn(btnClass[action.variant ?? "primary"])}
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
