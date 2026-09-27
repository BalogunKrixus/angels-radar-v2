import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { loginAction } from "@/lib/actions/auth.actions";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { Card } from "@/components/ui/Card";
import { Input, FormField } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Alert } from "@/components/ui/Alert";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string; reset?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect(`/${session.user.role}`);

  const { error, callbackUrl, reset } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <Card className="w-full max-w-sm">
          <h1 className="text-xl font-semibold text-ink">Log in</h1>
          <p className="mt-1 text-sm text-ink-soft">Welcome back to AngelsRadar.</p>

          <div className="mt-5 space-y-3">
            {error && <Alert tone="danger">That email or password isn&apos;t right.</Alert>}
            {reset && <Alert tone="success">Your password has been updated. Log in below.</Alert>}
          </div>

          <form action={loginAction} className="mt-6 space-y-4">
            <input type="hidden" name="callbackUrl" value={callbackUrl ?? ""} />
            <FormField label="Email" htmlFor="email" required>
              <Input id="email" name="email" type="email" autoComplete="email" required />
            </FormField>
            <FormField label="Password" htmlFor="password" required>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </FormField>
            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm text-accent hover:underline">
                Forgot password?
              </Link>
            </div>
            <SubmitButton className="w-full" pendingText="Logging in…">
              Log in
            </SubmitButton>
          </form>

          <p className="mt-6 text-center text-sm text-ink-soft">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-accent hover:underline">
              Sign up
            </Link>
          </p>
        </Card>
      </main>
      <PublicFooter />
    </div>
  );
}
