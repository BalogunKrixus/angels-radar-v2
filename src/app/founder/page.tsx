import { requireFounderContext } from "@/lib/session";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { EmptyState } from "@/components/ui/EmptyState";

const STATUS_COPY: Record<string, string> = {
  draft: "You haven't submitted your startup profile yet.",
  pending: "Your startup profile has been submitted and is currently being reviewed by AngelsRadar.",
  approved: "Your startup is approved and visible to approved investors on AngelsRadar.",
  changes_requested: "AngelsRadar has requested some changes before your startup can be approved.",
  rejected: "Your startup submission was not approved.",
};

export default async function FounderDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string }>;
}) {
  const { profile } = await requireFounderContext();
  const { submitted } = await searchParams;
  const startup = profile?.startup;

  if (!startup) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-ink">Your startup</h1>
        {submitted && <Alert tone="success">Thanks &mdash; your startup has been submitted for review.</Alert>}
        <EmptyState
          title="Let's create your startup profile"
          description="Tell investors what you're building. It takes about 10 minutes and you can save a draft at any time."
          action={<LinkButton href="/founder/startup">Complete profile</LinkButton>}
        />
      </div>
    );
  }

  const primaryAction =
    startup.status === "draft" ? (
      <LinkButton href="/founder/startup">Complete profile</LinkButton>
    ) : startup.status === "changes_requested" ? (
      <LinkButton href="/founder/startup">Edit profile</LinkButton>
    ) : (
      <LinkButton href="/founder/startup/view">View startup profile</LinkButton>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-ink">Your startup</h1>
      {submitted && <Alert tone="success">Thanks &mdash; your startup has been submitted for review.</Alert>}

      <Card className="max-w-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-ink-soft">Your startup</p>
            <h2 className="mt-0.5 text-lg font-semibold text-ink">{startup.name}</h2>
          </div>
          <StatusBadge status={startup.status} />
        </div>
        <p className="mt-4 text-sm text-ink-soft">{STATUS_COPY[startup.status]}</p>
        {(startup.status === "changes_requested" || startup.status === "rejected") && startup.adminNote && (
          <Alert tone={startup.status === "rejected" ? "danger" : "warning"} className="mt-4">
            {startup.adminNote}
          </Alert>
        )}
        <div className="mt-5">{primaryAction}</div>
      </Card>
    </div>
  );
}
