import { LinkButton } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";

export function PublicHeader() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo />
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
