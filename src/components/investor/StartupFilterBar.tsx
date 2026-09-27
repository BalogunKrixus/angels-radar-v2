import { Input, Select, FormField, CheckboxGroup, CheckboxOption } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { AFRICAN_COUNTRIES, INDUSTRIES, STAGES, TICKET_RANGES } from "@/lib/constants";

export function StartupFilterBar({
  tab,
  q,
  industries,
  countries,
  stages,
  ticket,
}: {
  tab: string;
  q: string;
  industries: string[];
  countries: string[];
  stages: string[];
  ticket: string;
}) {
  const industrySet = new Set(industries);
  const countrySet = new Set(countries);
  const stageSet = new Set(stages);

  return (
    <form className="space-y-4 rounded-xl border border-border bg-surface p-5">
      <input type="hidden" name="tab" value={tab} />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Search" htmlFor="q">
          <Input id="q" name="q" placeholder="Search name, keyword" defaultValue={q} />
        </FormField>
        <FormField label="Funding requirement" htmlFor="ticket">
          <Select id="ticket" name="ticket" defaultValue={ticket}>
            <option value="">Any amount</option>
            {TICKET_RANGES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>
        </FormField>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField label="Industry">
          <CheckboxGroup columns={1}>
            {INDUSTRIES.map((i) => (
              <CheckboxOption key={i} name="industry" value={i} label={i} defaultChecked={industrySet.has(i)} />
            ))}
          </CheckboxGroup>
        </FormField>
        <FormField label="Stage">
          <CheckboxGroup columns={1}>
            {STAGES.map((s) => (
              <CheckboxOption
                key={s.value}
                name="stage"
                value={s.value}
                label={s.label}
                defaultChecked={stageSet.has(s.value)}
              />
            ))}
          </CheckboxGroup>
        </FormField>
        <FormField label="Country">
          <CheckboxGroup columns={1}>
            {AFRICAN_COUNTRIES.map((c) => (
              <CheckboxOption key={c} name="country" value={c} label={c} defaultChecked={countrySet.has(c)} />
            ))}
          </CheckboxGroup>
        </FormField>
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" size="sm">
          Apply filters
        </Button>
        <a href={`/investor?tab=${tab}`} className="text-sm text-ink-soft hover:text-ink">
          Clear filters
        </a>
      </div>
    </form>
  );
}
