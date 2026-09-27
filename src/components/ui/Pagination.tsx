import Link from "next/link";
import { cn } from "@/lib/cn";

export function Pagination({
  page,
  totalPages,
  buildHref,
}: {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-1.5 pt-2" aria-label="Pagination">
      <PageLink disabled={page <= 1} href={buildHref(page - 1)}>
        Previous
      </PageLink>
      <span className="px-3 text-sm text-ink-soft">
        Page {page} of {totalPages}
      </span>
      <PageLink disabled={page >= totalPages} href={buildHref(page + 1)}>
        Next
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  disabled,
  children,
}: {
  href: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const classes = cn(
    "rounded-md border border-border px-3 py-1.5 text-sm",
    disabled
      ? "pointer-events-none text-ink-soft/40"
      : "text-ink hover:bg-paper"
  );
  if (disabled) return <span className={classes}>{children}</span>;
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
