import { requireInvestorContext } from "@/lib/session";
import { investorProfileAction } from "@/lib/actions/investor.actions";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input, Textarea, Select, FormField, CheckboxGroup, CheckboxOption } from "@/components/ui/Field";
import { FileInput } from "@/components/ui/FileInput";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Alert } from "@/components/ui/Alert";
import { StatusBadge } from "@/components/ui/Badge";
import {
  AFRICAN_COUNTRIES,
  INDUSTRIES,
  INVESTOR_TYPES,
  STAGES,
  TICKET_RANGES,
} from "@/lib/constants";

const ERROR_MESSAGES: Record<string, string> = {
  validation: "Please check the highlighted fields and try again.",
  incomplete: "Add your full name and country before submitting.",
  locked: "Your profile is currently under review and can't be edited right now.",
};

export default async function InvestorProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { profile } = await requireInvestorContext();
  const { error, saved } = await searchParams;
  if (!profile) return null;

  const locked = profile.status === "pending" || profile.status === "rejected";
  const isResubmit = profile.status === "changes_requested";
  const prefs = profile.preferences;
  const selectedSectors = new Set((prefs?.sectors as string[]) ?? []);
  const selectedCountries = new Set((prefs?.countries as string[]) ?? []);
  const selectedStages = new Set((prefs?.stages as string[]) ?? []);
  const selectedTickets = new Set((prefs?.ticketRanges as string[]) ?? []);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold text-ink">My profile</h1>
        <StatusBadge status={profile.status} />
      </div>

      <div className="space-y-2">
        {error && <Alert tone="danger">{ERROR_MESSAGES[error] ?? "Something went wrong."}</Alert>}
        {saved && <Alert tone="success">Your changes have been saved.</Alert>}
        {profile.status === "pending" && (
          <Alert tone="info">Your investor profile is being reviewed by AngelsRadar.</Alert>
        )}
        {profile.status === "changes_requested" && profile.adminNote && (
          <Alert tone="warning">
            <span className="font-medium">AngelsRadar requested changes:</span> {profile.adminNote}
          </Alert>
        )}
        {profile.status === "rejected" && (
          <Alert tone="danger">
            Your investor application was not approved.
            {profile.adminNote ? ` ${profile.adminNote}` : ""}
          </Alert>
        )}
      </div>

      <form action={investorProfileAction} className="space-y-6">
        <fieldset disabled={locked} className="space-y-6">
          <Card>
            <CardHeader title="Basic information" />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Full name" htmlFor="fullName" required>
                <Input id="fullName" name="fullName" defaultValue={profile.fullName} required />
              </FormField>
              <FormField label="Job title / role" htmlFor="jobTitle">
                <Input id="jobTitle" name="jobTitle" defaultValue={profile.jobTitle ?? ""} />
              </FormField>
              <FormField label="Organisation / fund" htmlFor="organisation">
                <Input id="organisation" name="organisation" defaultValue={profile.organisation ?? ""} />
              </FormField>
              <FormField label="Investor type" htmlFor="investorType">
                <Select id="investorType" name="investorType" defaultValue={profile.investorType}>
                  {INVESTOR_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Country" htmlFor="country" required>
                <Select id="country" name="country" defaultValue={profile.country}>
                  <option value="">Select a country</option>
                  {AFRICAN_COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField label="City" htmlFor="city">
                <Input id="city" name="city" defaultValue={profile.city ?? ""} />
              </FormField>
              <FormField label="LinkedIn" htmlFor="linkedin">
                <Input id="linkedin" name="linkedin" placeholder="https://" defaultValue={profile.linkedin ?? ""} />
              </FormField>
              <FormField label="Website" htmlFor="website">
                <Input id="website" name="website" placeholder="https://" defaultValue={profile.website ?? ""} />
              </FormField>
            </div>
            <div className="mt-4">
              <FileInput
                name="photo"
                label="Profile photo"
                accept="image/png,image/jpeg,image/webp"
                currentLabel={profile.photo ? "Uploaded" : undefined}
              />
            </div>
          </Card>

          <Card>
            <CardHeader title="Investment preferences" />
            <div className="space-y-5">
              <FormField label="Sectors">
                <CheckboxGroup columns={2}>
                  {INDUSTRIES.map((s) => (
                    <CheckboxOption key={s} name="sectors" value={s} label={s} defaultChecked={selectedSectors.has(s)} />
                  ))}
                </CheckboxGroup>
              </FormField>
              <FormField label="Preferred stages">
                <CheckboxGroup columns={2}>
                  {STAGES.map((s) => (
                    <CheckboxOption
                      key={s.value}
                      name="stages"
                      value={s.value}
                      label={s.label}
                      defaultChecked={selectedStages.has(s.value)}
                    />
                  ))}
                </CheckboxGroup>
              </FormField>
              <FormField label="Typical investment amount">
                <CheckboxGroup columns={2}>
                  {TICKET_RANGES.map((t) => (
                    <CheckboxOption
                      key={t.value}
                      name="ticketRanges"
                      value={t.value}
                      label={t.label}
                      defaultChecked={selectedTickets.has(t.value)}
                    />
                  ))}
                </CheckboxGroup>
              </FormField>
              <FormField label="Geography">
                <CheckboxGroup columns={3}>
                  {AFRICAN_COUNTRIES.map((c) => (
                    <CheckboxOption key={c} name="countries" value={c} label={c} defaultChecked={selectedCountries.has(c)} />
                  ))}
                </CheckboxGroup>
              </FormField>
              <FormField label="Investment thesis" htmlFor="investmentThesis" hint="Optional short description.">
                <Textarea id="investmentThesis" name="investmentThesis" defaultValue={profile.investmentThesis ?? ""} />
              </FormField>
            </div>
          </Card>
        </fieldset>

        {!locked && (
          <div className="flex items-center gap-3 pb-10">
            <SubmitButton name="intent" value="draft" variant="secondary" pendingText="Saving…">
              Save
            </SubmitButton>
            {profile.status !== "approved" && (
              <SubmitButton name="intent" value="submit" pendingText="Submitting…">
                {isResubmit ? "Resubmit for approval" : "Submit for approval"}
              </SubmitButton>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
