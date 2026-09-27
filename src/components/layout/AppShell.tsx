import Link from "next/link";
import { logoutAction } from "@/lib/actions/auth.actions";
import { SubmitButton } from "@/components/ui/SubmitButton";

export interface NavItem {
  href: string;
  label: string;
}

export function AppShell({
  primaryNav,
  secondaryHref,
  secondaryLabel,
  email,
  children,
}: {
  primaryNav: NavItem[];
  secondaryHref: string;
  secondaryLabel: string;
  email: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-4">
          <Link href="/" className="text-base font-semibold tracking-tight text-ink">
            AngelsRadar
          </Link>
          <nav className="order-3 flex w-full items-center gap-5 sm:order-none sm:w-auto">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-ink-soft hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Link href={secondaryHref} className="text-sm text-ink-soft hover:text-ink">
              {secondaryLabel}
            </Link>
            <span className="hidden text-sm text-ink-soft/70 lg:inline">{email}</span>
            <form action={logoutAction}>
              <SubmitButton variant="secondary" size="sm">
                Log out
              </SubmitButton>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
