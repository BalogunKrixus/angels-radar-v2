import { cn } from "@/lib/cn";
import { statusLabel } from "@/lib/constants";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-paper text-ink-soft border-border",
  pending: "bg-warning-soft text-warning border-transparent",
  approved: "bg-success-soft text-success border-transparent",
  changes_requested: "bg-warning-soft text-warning border-transparent",
  rejected: "bg-danger-soft text-danger border-transparent",
  suspended: "bg-danger-soft text-danger border-transparent",
  new: "bg-info-soft text-info border-transparent",
  contacted: "bg-warning-soft text-warning border-transparent",
  completed: "bg-success-soft text-success border-transparent",
  active: "bg-success-soft text-success border-transparent",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[status] ?? "bg-paper text-ink-soft border-border",
        className
      )}
    >
      {statusLabel(status)}
    </span>
  );
}

export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-paper border border-border px-2.5 py-0.5 text-xs text-ink-soft",
        className
      )}
    >
      {children}
    </span>
  );
}
