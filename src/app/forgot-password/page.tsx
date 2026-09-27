import Link from "next/link";
import { requestPasswordResetAction } from "@/lib/actions/password-reset.actions";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { Card } from "@/components/ui/Card";
import { Input, FormField } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Alert } from "@/components/ui/Alert";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const { sent } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <Card className="w-full max-w-sm">
          <h1 className="text-xl font-semibold text-ink">Reset your password</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Enter your registered email and we&apos;ll send you a reset link.
          </p>

          {sent ? (
            <Alert tone="success" className="mt-5">
              If an account exists for that email, we&apos;ve sent a reset link.
            </Alert>
          ) : (
            <form action={requestPasswordResetAction} className="mt-6 space-y-4">
              <FormField label="Email" htmlFor="email" required>
                <Input id="email" name="email" type="email" autoComplete="email" required />
              </FormField>
              <SubmitButton className="w-full" pendingText="Sending…">
                Send reset link
              </SubmitButton>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-ink-soft">
            <Link href="/login" className="text-accent hover:underline">
              Back to login
            </Link>
          </p>
        </Card>
      </main>
      <PublicFooter />
    </div>
  );
}
