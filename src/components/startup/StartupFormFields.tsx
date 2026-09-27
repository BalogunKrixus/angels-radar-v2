import { Card, CardHeader } from "@/components/ui/Card";
import { Input, Textarea, Select, FormField } from "@/components/ui/Field";
import { FileInput } from "@/components/ui/FileInput";
import { TeamMembersField, LinksField } from "@/components/founder/RepeatableRows";
import { AFRICAN_COUNTRIES, CURRENCIES, INDUSTRIES, STAGES } from "@/lib/constants";
import type { StartupWithRelations } from "@/components/startup/StartupDetail";

/** The full set of startup profile form sections, shared by the founder edit form and the admin edit form. */
export function StartupFormFields({ startup }: { startup: StartupWithRelations | null }) {
  return (
    <>
      <Card>
        <CardHeader title="Basic information" />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Startup name" htmlFor="name" required>
            <Input id="name" name="name" defaultValue={startup?.name} required />
          </FormField>
          <FormField label="Website" htmlFor="website">
            <Input id="website" name="website" placeholder="https://" defaultValue={startup?.website ?? ""} />
          </FormField>
        </div>
        <div className="mt-4">
          <FormField label="One-line description" htmlFor="tagline" required hint="Shown on the startup card.">
            <Input id="tagline" name="tagline" maxLength={160} defaultValue={startup?.tagline ?? ""} />
          </FormField>
        </div>
        <div className="mt-4">
          <FormField label="Full company description" htmlFor="description" required>
            <Textarea id="description" name="description" rows={5} defaultValue={startup?.description ?? ""} />
          </FormField>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <FormField label="Country" htmlFor="country" required>
            <Select id="country" name="country" defaultValue={startup?.country ?? ""}>
              <option value="">Select a country</option>
              {AFRICAN_COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="City" htmlFor="city">
            <Input id="city" name="city" defaultValue={startup?.city ?? ""} />
          </FormField>
          <FormField label="Industry" htmlFor="industry" required>
            <Select id="industry" name="industry" defaultValue={startup?.industry ?? ""}>
              <option value="">Select an industry</option>
              {INDUSTRIES.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </Select>
          </FormField>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <FormField label="Founded year" htmlFor="foundedYear">
            <Input
              id="foundedYear"
              name="foundedYear"
              type="number"
              min={1900}
              max={2100}
              defaultValue={startup?.foundedYear ?? undefined}
            />
          </FormField>
        </div>
        <div className="mt-4">
          <FileInput
            name="logo"
            label="Logo"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            currentLabel={startup?.logo ? "Uploaded" : undefined}
          />
        </div>
      </Card>

      <Card>
        <CardHeader title="Business" />
        <div className="space-y-4">
          <FormField label="Problem" htmlFor="problem">
            <Textarea id="problem" name="problem" defaultValue={startup?.problem ?? ""} />
          </FormField>
          <FormField label="Solution" htmlFor="solution">
            <Textarea id="solution" name="solution" defaultValue={startup?.solution ?? ""} />
          </FormField>
          <FormField label="Business model" htmlFor="businessModel">
            <Textarea id="businessModel" name="businessModel" defaultValue={startup?.businessModel ?? ""} />
          </FormField>
          <FormField label="Target market" htmlFor="targetMarket">
            <Textarea id="targetMarket" name="targetMarket" defaultValue={startup?.targetMarket ?? ""} />
          </FormField>
          <FormField label="Product / service description" htmlFor="productDescription">
            <Textarea
              id="productDescription"
              name="productDescription"
              defaultValue={startup?.productDescription ?? ""}
            />
          </FormField>
        </div>
      </Card>

      <Card>
        <CardHeader title="Funding" />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Current stage" htmlFor="stage">
            <Select id="stage" name="stage" defaultValue={startup?.stage ?? "pre_seed"}>
              {STAGES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Select>
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Amount raising" htmlFor="amountRaising">
              <Input
                id="amountRaising"
                name="amountRaising"
                type="number"
                min={0}
                defaultValue={startup?.amountRaising ?? undefined}
              />
            </FormField>
            <FormField label="Currency" htmlFor="currency">
              <Select id="currency" name="currency" defaultValue={startup?.currency ?? "USD"}>
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>
        </div>
        <div className="mt-4 space-y-4">
          <FormField label="Previous funding (if applicable)" htmlFor="previousFunding">
            <Input id="previousFunding" name="previousFunding" defaultValue={startup?.previousFunding ?? ""} />
          </FormField>
          <FormField label="What are you raising for?" htmlFor="fundingUse">
            <Textarea id="fundingUse" name="fundingUse" defaultValue={startup?.fundingUse ?? ""} />
          </FormField>
        </div>
      </Card>

      <Card>
        <CardHeader title="Traction" description="Keep it simple — fill in what's relevant." />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Revenue" htmlFor="revenue">
            <Input id="revenue" name="revenue" defaultValue={startup?.revenue ?? ""} />
          </FormField>
          <FormField label="Revenue range" htmlFor="revenueRange">
            <Input id="revenueRange" name="revenueRange" defaultValue={startup?.revenueRange ?? ""} />
          </FormField>
          <FormField label="Customers / users" htmlFor="customerCount">
            <Input id="customerCount" name="customerCount" defaultValue={startup?.customerCount ?? ""} />
          </FormField>
          <FormField label="Growth information" htmlFor="growthInfo">
            <Input id="growthInfo" name="growthInfo" defaultValue={startup?.growthInfo ?? ""} />
          </FormField>
        </div>
        <div className="mt-4">
          <FormField label="Other relevant traction" htmlFor="tractionNotes">
            <Textarea id="tractionNotes" name="tractionNotes" defaultValue={startup?.tractionNotes ?? ""} />
          </FormField>
        </div>
      </Card>

      <Card>
        <CardHeader title="Team" description="Your own name and role come from the founder profile." />
        <FormField label="Team summary" htmlFor="teamDescription">
          <Textarea id="teamDescription" name="teamDescription" defaultValue={startup?.teamDescription ?? ""} />
        </FormField>
        <div className="mt-5">
          <TeamMembersField
            initial={(startup?.teamMembers ?? []).map((m) => ({
              name: m.name ?? undefined,
              role: m.role ?? undefined,
              bio: m.bio ?? undefined,
              linkedin: m.linkedin ?? undefined,
            }))}
          />
        </div>
      </Card>

      <Card>
        <CardHeader title="Links" />
        <LinksField
          initial={(startup?.links ?? []).map((l) => ({
            label: l.label ?? undefined,
            url: l.url ?? undefined,
          }))}
        />
      </Card>

      <Card>
        <CardHeader title="Pitch deck" description="PDF only. Only visible to approved, logged-in investors." />
        <FileInput
          name="pitchDeck"
          label="Upload pitch deck"
          accept="application/pdf"
          currentLabel={startup?.pitchDeckOriginalName}
        />
      </Card>
    </>
  );
}
