import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";

export function PublicHeader() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-base font-semibold tracking-tight text-ink">
          AngelsRadar
        </Link>
        <div className="flex items-center gap-3">
          <LinkButton href="/login" variant="ghost" size="sm">
            Log in
          </LinkButton>
          <LinkButton href="/signup" variant="primary" size="sm">
            Sign up
          </LinkButton>
        </div>
      </div>
    </header>
  );
}
