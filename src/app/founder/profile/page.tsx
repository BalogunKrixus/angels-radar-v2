import { requireFounderContext } from "@/lib/session";
import { founderProfileAction } from "@/lib/actions/startup.actions";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input, FormField } from "@/components/ui/Field";
import { FileInput } from "@/components/ui/FileInput";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Alert } from "@/components/ui/Alert";

export default async function FounderProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { profile } = await requireFounderContext();
  const { saved, error } = await searchParams;

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-semibold text-ink">My profile</h1>

      {saved && <Alert tone="success">Your profile has been saved.</Alert>}
      {error && <Alert tone="danger">Please enter your full name.</Alert>}

      <Card>
        <CardHeader title="About you" description="This appears alongside your startup's team section." />
        <form action={founderProfileAction} className="space-y-4">
          <FormField label="Full name" htmlFor="fullName" required>
            <Input id="fullName" name="fullName" defaultValue={profile?.fullName ?? ""} required />
          </FormField>
          <FormField label="Role / title" htmlFor="title" hint="e.g. CEO &amp; Co-founder">
            <Input id="title" name="title" defaultValue={profile?.title ?? ""} />
          </FormField>
          <FormField label="LinkedIn" htmlFor="linkedin">
            <Input id="linkedin" name="linkedin" placeholder="https://" defaultValue={profile?.linkedin ?? ""} />
          </FormField>
          <FormField label="Phone" htmlFor="phone">
            <Input id="phone" name="phone" defaultValue={profile?.phone ?? ""} />
          </FormField>
          <FileInput
            name="photo"
            label="Photo"
            accept="image/png,image/jpeg,image/webp"
            currentLabel={profile?.photo ? "Uploaded" : undefined}
          />
          <SubmitButton pendingText="Saving…">Save profile</SubmitButton>
        </form>
      </Card>
    </div>
  );
}
