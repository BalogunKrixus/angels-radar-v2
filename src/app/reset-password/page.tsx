import Link from "next/link";
import { resetPasswordAction } from "@/lib/actions/password-reset.actions";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { Card } from "@/components/ui/Card";
import { Input, FormField } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Alert } from "@/components/ui/Alert";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const { token, error } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <Card className="w-full max-w-sm">
          <h1 className="text-xl font-semibold text-ink">Choose a new password</h1>

          {error && (
            <Alert tone="danger" className="mt-4">
              {error === "expired"
                ? "That reset link has expired or was already used. Request a new one."
                : "Please enter a password with at least 8 characters."}
            </Alert>
          )}

          {!token ? (
            <p className="mt-4 text-sm text-ink-soft">
              This reset link is missing its token.{" "}
              <Link href="/forgot-password" className="text-accent hover:underline">
                Request a new one
              </Link>
              .
            </p>
          ) : (
            <form action={resetPasswordAction} className="mt-6 space-y-4">
              <input type="hidden" name="token" value={token} />
              <FormField
                label="New password"
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
              <SubmitButton className="w-full" pendingText="Saving…">
                Reset password
              </SubmitButton>
            </form>
          )}
        </Card>
      </main>
      <PublicFooter />
    </div>
  );
}
