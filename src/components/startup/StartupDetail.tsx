import type { Startup, TeamMember, Link as StartupLink } from "@prisma/client";
import { StatusBadge } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";
import { labelFor, STAGES } from "@/lib/constants";

export type StartupWithRelations = Startup & {
  teamMembers: TeamMember[];
  links: StartupLink[];
};

function formatAmount(amount: number | null, currency: string) {
  if (amount == null) return null;
  return `${currency} ${amount.toLocaleString()}`;
}

export function StartupDetail({
  startup,
  logoUrl,
  pitchDeckUrl,
  showStatus = false,
  actions,
}: {
  startup: StartupWithRelations;
  logoUrl?: string | null;
  pitchDeckUrl?: string | null;
  showStatus?: boolean;
  actions?: React.ReactNode;
}) {
  const amount = formatAmount(startup.amountRaising, startup.currency);

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-start gap-4">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={`${startup.name} logo`} className="h-16 w-16 rounded-lg object-cover border border-border" />
          ) : (
            <div className="h-16 w-16 rounded-lg bg-paper border border-border flex items-center justify-center text-lg font-semibold text-ink-soft">
              {startup.name.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold text-ink">{startup.name}</h1>
              {showStatus && <StatusBadge status={startup.status} />}
            </div>
            <p className="mt-1 text-sm text-ink-soft">{startup.tagline}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {startup.country && <MetaTag>{startup.country}</MetaTag>}
              {startup.industry && <MetaTag>{startup.industry}</MetaTag>}
              <MetaTag>{labelFor(startup.stage, STAGES)}</MetaTag>
            </div>
          </div>
          {actions}
        </div>
      </Card>

      <Card>
        <CardHeader title="About" />
        <p className="whitespace-pre-line text-sm text-ink">{startup.description || "—"}</p>
      </Card>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader title="Problem" />
          <p className="whitespace-pre-line text-sm text-ink">{startup.problem || "—"}</p>
        </Card>
        <Card>
          <CardHeader title="Solution" />
          <p className="whitespace-pre-line text-sm text-ink">{startup.solution || "—"}</p>
        </Card>
      </div>

      <Card>
        <CardHeader title="Market" />
        <p className="whitespace-pre-line text-sm text-ink">{startup.targetMarket || "—"}</p>
      </Card>

      <Card>
        <CardHeader title="Business" />
        <div className="space-y-3 text-sm text-ink">
          {startup.businessModel && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">Business model</p>
              <p className="whitespace-pre-line mt-1">{startup.businessModel}</p>
            </div>
          )}
          {startup.productDescription && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">Product / service</p>
              <p className="whitespace-pre-line mt-1">{startup.productDescription}</p>
            </div>
          )}
          {!startup.businessModel && !startup.productDescription && (
            <p className="text-ink-soft">No business details provided.</p>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader title="Traction" />
        <dl className="grid gap-4 sm:grid-cols-2 text-sm">
          {startup.revenue && <Fact label="Revenue" value={startup.revenue} />}
          {startup.revenueRange && <Fact label="Revenue range" value={startup.revenueRange} />}
          {startup.customerCount && <Fact label="Customers / users" value={startup.customerCount} />}
          {startup.growthInfo && <Fact label="Growth" value={startup.growthInfo} />}
        </dl>
        {startup.tractionNotes && (
          <p className="mt-3 whitespace-pre-line text-sm text-ink">{startup.tractionNotes}</p>
        )}
        {!startup.revenue &&
          !startup.revenueRange &&
          !startup.customerCount &&
          !startup.growthInfo &&
          !startup.tractionNotes && <p className="text-sm text-ink-soft">No traction details provided.</p>}
      </Card>

      <Card>
        <CardHeader title="Funding" />
        <dl className="grid gap-4 sm:grid-cols-2 text-sm">
          <Fact label="Stage" value={labelFor(startup.stage, STAGES)} />
          {amount && <Fact label="Amount raising" value={amount} />}
          {startup.previousFunding && <Fact label="Previous funding" value={startup.previousFunding} />}
        </dl>
        {startup.fundingUse && (
          <div className="mt-3">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">Use of funds</p>
            <p className="whitespace-pre-line mt-1 text-sm text-ink">{startup.fundingUse}</p>
          </div>
        )}
      </Card>

      <Card>
        <CardHeader title="Team" />
        {startup.teamDescription && (
          <p className="mb-3 whitespace-pre-line text-sm text-ink">{startup.teamDescription}</p>
        )}
        {startup.teamMembers.length > 0 ? (
          <ul className="space-y-3">
            {startup.teamMembers.map((m) => (
              <li key={m.id} className="text-sm">
                <p className="font-medium text-ink">
                  {m.name} {m.role && <span className="font-normal text-ink-soft">&middot; {m.role}</span>}
                </p>
                {m.bio && <p className="mt-0.5 text-ink-soft">{m.bio}</p>}
                {m.linkedin && (
                  <a href={m.linkedin} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                    LinkedIn
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          !startup.teamDescription && <p className="text-sm text-ink-soft">No additional team members listed.</p>
        )}
      </Card>

      {pitchDeckUrl && (
        <Card>
          <CardHeader title="Pitch deck" />
          <a
            href={pitchDeckUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-paper px-4 py-2.5 text-sm font-medium text-ink hover:bg-border/40"
          >
            View pitch deck (PDF)
          </a>
        </Card>
      )}

      {(startup.website || startup.links.length > 0) && (
        <Card>
          <CardHeader title="Links" />
          <ul className="space-y-1.5 text-sm">
            {startup.website && (
              <li>
                <a href={startup.website} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                  {startup.website}
                </a>
              </li>
            )}
            {startup.links.map((l) => (
              <li key={l.id}>
                <a href={l.url} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                  {l.label || l.url}
                </a>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

function MetaTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-paper border border-border px-2.5 py-0.5 text-xs text-ink-soft">
      {children}
    </span>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-ink-soft">{label}</dt>
      <dd className="mt-0.5 text-ink">{value}</dd>
    </div>
  );
}
