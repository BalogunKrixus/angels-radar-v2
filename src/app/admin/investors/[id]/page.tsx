import { notFound } from "next/navigation";
import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card, CardHeader } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Badge";
import { StatusUpdateForm } from "@/components/admin/StatusUpdateForm";
import { updateInvestorStatusAction } from "@/lib/actions/admin.actions";
import { LinkButton } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { fileUrl } from "@/lib/file-url";
import { INVESTOR_STATUSES, INVESTOR_TYPES, STAGES, TICKET_RANGES, labelFor } from "@/lib/constants";

export default async function AdminInvestorDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ updated?: string }>;
}) {
  await requireRole("admin");
  const { id } = await params;
  const { updated } = await searchParams;

  const investor = await prisma.investorProfile.findUnique({
    where: { id },
    include: { user: true, preferences: true },
  });
  if (!investor) notFound();

  const sectors = (investor.preferences?.sectors as string[]) ?? [];
  const countries = (investor.preferences?.countries as string[]) ?? [];
  const stages = (investor.preferences?.stages as string[]) ?? [];
  const ticketRanges = (investor.preferences?.ticketRanges as string[]) ?? [];
  const photoUrl = fileUrl(investor.photo);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px] max-w-6xl">
      <div className="space-y-4">
        <LinkButton href="/admin/investors" variant="ghost" size="sm">
          &larr; Back to investors
        </LinkButton>
        {updated && <Alert tone="success">Status updated.</Alert>}

        <Card>
          <div className="flex items-start gap-4">
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoUrl} alt="" className="h-16 w-16 rounded-full object-cover border border-border" />
            ) : (
              <div className="h-16 w-16 rounded-full bg-paper border border-border" />
            )}
            <div>
              <h1 className="text-xl font-semibold text-ink">{investor.fullName || "(no name yet)"}</h1>
              <p className="text-sm text-ink-soft">
                {investor.jobTitle}
                {investor.organisation ? ` at ${investor.organisation}` : ""}
              </p>
              <p className="text-sm text-ink-soft">{investor.country}</p>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Contact" />
          <dl className="grid gap-3 sm:grid-cols-2 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wide text-ink-soft">Email</dt>
              <dd className="text-ink">{investor.user.email}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-ink-soft">Type</dt>
              <dd className="text-ink">{labelFor(investor.investorType, INVESTOR_TYPES)}</dd>
            </div>
            {investor.linkedin && (
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink-soft">LinkedIn</dt>
                <dd>
                  <a href={investor.linkedin} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                    {investor.linkedin}
                  </a>
                </dd>
              </div>
            )}
            {investor.website && (
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink-soft">Website</dt>
                <dd>
                  <a href={investor.website} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                    {investor.website}
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </Card>

        {investor.investmentThesis && (
          <Card>
            <CardHeader title="Investment thesis" />
            <p className="whitespace-pre-line text-sm text-ink">{investor.investmentThesis}</p>
          </Card>
        )}

        <Card>
          <CardHeader title="Investment preferences" />
          <div className="space-y-3">
            <PreferenceRow label="Sectors" values={sectors} />
            <PreferenceRow label="Countries" values={countries} />
            <PreferenceRow label="Stages" values={stages.map((s) => labelFor(s, STAGES))} />
            <PreferenceRow label="Ticket size" values={ticketRanges.map((t) => labelFor(t, TICKET_RANGES))} />
          </div>
        </Card>
      </div>
      <div className="space-y-4">
        <StatusUpdateForm
          action={updateInvestorStatusAction}
          idField="investorId"
          idValue={investor.id}
          statusOptions={INVESTOR_STATUSES}
          currentStatus={investor.status}
          currentNote={investor.adminNote}
        />
      </div>
    </div>
  );
}

function PreferenceRow({ label, values }: { label: string; values: string[] }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">{label}</p>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {values.length > 0 ? (
          values.map((v) => <Tag key={v}>{v}</Tag>)
        ) : (
          <span className="text-sm text-ink-soft">Not specified</span>
        )}
      </div>
    </div>
  );
}
