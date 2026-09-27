import { changePasswordAction } from "@/lib/actions/auth.actions";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input, FormField } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Alert } from "@/components/ui/Alert";

export function AccountSettingsCard({
  email,
  accountPath,
  error,
  success,
}: {
  email: string;
  accountPath: string;
  error?: string;
  success?: string;
}) {
  return (
    <div className="max-w-lg space-y-6">
      <Card>
        <CardHeader title="Account" description="Your login details." />
        <FormField label="Email">
          <Input value={email} disabled />
        </FormField>
      </Card>

      <Card>
        <CardHeader title="Change password" />
        <div className="mb-4 space-y-2">
          {error === "invalid" && <Alert tone="danger">Your current password is incorrect.</Alert>}
          {error === "weak" && <Alert tone="danger">New password must be at least 8 characters.</Alert>}
          {success && <Alert tone="success">Your password has been updated.</Alert>}
        </div>
        <form action={changePasswordAction} className="space-y-4">
          <input type="hidden" name="accountPath" value={accountPath} />
          <FormField label="Current password" htmlFor="currentPassword" required>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              required
            />
          </FormField>
          <FormField label="New password" htmlFor="newPassword" required hint="At least 8 characters.">
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </FormField>
          <SubmitButton pendingText="Saving…">Update password</SubmitButton>
        </form>
      </Card>
    </div>
  );
}
