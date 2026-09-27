import { notFound } from "next/navigation";
import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { StartupDetail } from "@/components/startup/StartupDetail";
import { StatusUpdateForm } from "@/components/admin/StatusUpdateForm";
import { updateStartupStatusAction } from "@/lib/actions/admin.actions";
import { LinkButton } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Card, CardHeader } from "@/components/ui/Card";
import { fileUrl } from "@/lib/file-url";
import { STARTUP_STATUSES } from "@/lib/constants";
import { logAnalyticsEvent } from "@/lib/analytics";

export default async function AdminStartupDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; updated?: string }>;
}) {
  await requireRole("admin");
  const { id } = await params;
  const { saved, updated } = await searchParams;

  const startup = await prisma.startup.findUnique({
    where: { id },
    include: { teamMembers: true, links: true, founder: { include: { user: true } } },
  });
  if (!startup) notFound();

  await logAnalyticsEvent("startup_viewed", undefined, { startupId: startup.id, viewer: "admin" });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px] max-w-6xl">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <LinkButton href="/admin/startups" variant="ghost" size="sm">
            &larr; Back to startups
          </LinkButton>
          <LinkButton href={`/admin/startups/${startup.id}/edit`} variant="secondary" size="sm">
            Edit startup information
          </LinkButton>
        </div>
        {saved && <Alert tone="success">Changes saved.</Alert>}
        {updated && <Alert tone="success">Status updated.</Alert>}
        <StartupDetail
          startup={startup}
          logoUrl={fileUrl(startup.logo)}
          pitchDeckUrl={fileUrl(startup.pitchDeckPath)}
          showStatus
        />
      </div>
      <div className="space-y-4">
        <Card>
          <CardHeader title="Founder" />
          <p className="text-sm text-ink">{startup.founder.fullName || "—"}</p>
          <p className="text-sm text-ink-soft">{startup.founder.user.email}</p>
          {startup.founder.phone && <p className="text-sm text-ink-soft">{startup.founder.phone}</p>}
        </Card>
        <StatusUpdateForm
          action={updateStartupStatusAction}
          idField="startupId"
          idValue={startup.id}
          statusOptions={STARTUP_STATUSES}
          currentStatus={startup.status}
          currentNote={startup.adminNote}
        />
      </div>
    </div>
  );
}
