import { notFound, redirect } from "next/navigation";
import { requireInvestorContext } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { StartupDetail } from "@/components/startup/StartupDetail";
import { LinkButton } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { fileUrl } from "@/lib/file-url";
import { logAnalyticsEvent } from "@/lib/analytics";

export default async function InvestorStartupDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ requested?: string }>;
}) {
  const { authUser, profile } = await requireInvestorContext();
  if (!profile || profile.status !== "approved") redirect("/investor");

  const { id } = await params;
  const { requested } = await searchParams;
  const startup = await prisma.startup.findUnique({
    where: { id },
    include: { teamMembers: true, links: true },
  });
  if (!startup || startup.status !== "approved") notFound();

  await logAnalyticsEvent("startup_viewed", authUser.id, { startupId: startup.id });

  const activeRequest = await prisma.introductionRequest.findFirst({
    where: {
      startupId: startup.id,
      investorId: profile.id,
      status: { in: ["new", "contacted"] },
    },
  });

  return (
    <div className="max-w-3xl space-y-6">
      <LinkButton href="/investor" variant="ghost" size="sm">
        &larr; Back to Discover Startups
      </LinkButton>

      {requested && (
        <Alert tone="success">
          Your introduction request has been sent. AngelsRadar will follow up with you regarding the introduction.
        </Alert>
      )}
      {!requested && activeRequest && (
        <Alert tone="info">
          You&apos;ve already requested an introduction to {startup.name}. AngelsRadar will follow up with you.
        </Alert>
      )}

      <StartupDetail
        startup={startup}
        logoUrl={fileUrl(startup.logo)}
        pitchDeckUrl={fileUrl(startup.pitchDeckPath)}
        actions={
          !activeRequest && (
            <LinkButton href={`/investor/startups/${startup.id}/request`}>Request Introduction</LinkButton>
          )
        }
      />
    </div>
  );
}
