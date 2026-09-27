import { cn } from "@/lib/cn";

type Tone = "success" | "danger" | "info" | "warning";

const toneClasses: Record<Tone, string> = {
  success: "bg-success-soft text-success border-success/20",
  danger: "bg-danger-soft text-danger border-danger/20",
  info: "bg-info-soft text-info border-info/20",
  warning: "bg-warning-soft text-warning border-warning/20",
};

export function Alert({
  tone = "info",
  children,
  className,
}: {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={cn(
        "rounded-lg border px-4 py-3 text-sm",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </div>
  );
}
