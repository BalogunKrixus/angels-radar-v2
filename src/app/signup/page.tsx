import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { signupAction } from "@/lib/actions/auth.actions";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { Card } from "@/components/ui/Card";
import { Input, FormField } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Alert } from "@/components/ui/Alert";
import { cn } from "@/lib/cn";

const ERROR_MESSAGES: Record<string, string> = {
  exists: "An account with that email already exists. Try logging in instead.",
  invalid: "Please enter a valid email and a password with at least 8 characters.",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; error?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect(`/${session.user.role}`);

  const { role: rawRole, error } = await searchParams;
  const role = rawRole === "investor" ? "investor" : "founder";

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <Card className="w-full max-w-sm">
          <h1 className="text-xl font-semibold text-ink">Create your account</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Join AngelsRadar as a founder or an investor.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2 rounded-lg border border-border bg-paper p-1">
            <RoleTab href="/signup?role=founder" active={role === "founder"}>
              I&apos;m a Founder
            </RoleTab>
            <RoleTab href="/signup?role=investor" active={role === "investor"}>
              I&apos;m an Investor
            </RoleTab>
          </div>

          {error && (
            <Alert tone="danger" className="mt-4">
              {ERROR_MESSAGES[error] ?? "Something went wrong. Please try again."}
            </Alert>
          )}

          <form action={signupAction} className="mt-6 space-y-4">
            <input type="hidden" name="role" value={role} />
            <FormField label="Email" htmlFor="email" required>
              <Input id="email" name="email" type="email" autoComplete="email" required />
            </FormField>
            <FormField
              label="Password"
              htmlFor="password"
              required
              hint="At least 8 characters."
            >
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </FormField>
            <SubmitButton className="w-full" pendingText="Creating account…">
              Create account
            </SubmitButton>
          </form>

          <p className="mt-6 text-center text-sm text-ink-soft">
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:underline">
              Log in
            </Link>
          </p>
        </Card>
      </main>
      <PublicFooter />
    </div>
  );
}

function RoleTab({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-md px-3 py-2 text-center text-sm font-medium transition-colors",
        active ? "bg-surface text-ink shadow-sm" : "text-ink-soft hover:text-ink"
      )}
    >
      {children}
    </Link>
  );
}
