import Link from "next/link";
import { requireInvestorContext } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { StartupCard } from "@/components/startup/StartupCard";
import { StartupFilterBar } from "@/components/investor/StartupFilterBar";
import { buildStartupWhere } from "@/lib/startup-query";
import { cn } from "@/lib/cn";

const PAGE_SIZE = 12;

const STATUS_COPY: Record<string, string> = {
  draft: "Complete and submit your investor profile to start discovering startups.",
  pending: "Your investor profile has been submitted and is currently being reviewed by AngelsRadar.",
  changes_requested: "AngelsRadar has requested some changes before your profile can be approved.",
  rejected: "Your investor application was not approved.",
};

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export default async function InvestorDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    tab?: string;
    q?: string;
    industry?: string | string[];
    country?: string | string[];
    stage?: string | string[];
    ticket?: string;
    page?: string;
    submitted?: string;
  }>;
}) {
  const { profile } = await requireInvestorContext();

  if (!profile || profile.status !== "approved") {
    const status = profile?.status ?? "draft";
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-ink">Discover Startups</h1>
        <Card className="max-w-xl">
          <div className="flex items-center justify-between">
            <p className="text-sm text-ink-soft">Profile status</p>
            <StatusBadge status={status} />
          </div>
          <p className="mt-3 text-sm text-ink">{STATUS_COPY[status]}</p>
          {(status === "changes_requested" || status === "rejected") && profile?.adminNote && (
            <Alert tone={status === "rejected" ? "danger" : "warning"} className="mt-4">
              {profile.adminNote}
            </Alert>
          )}
          <div className="mt-5">
            <Link
              href="/investor/profile"
              className="inline-flex items-center justify-center rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-ink/90"
            >
              {status === "draft" ? "Complete profile" : "View profile"}
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const params = await searchParams;
  const tab = params.tab === "all" ? "all" : "recommended";
  const q = params.q?.trim() ?? "";
  const industries = toArray(params.industry);
  const countries = toArray(params.country);
  const stages = toArray(params.stage);
  const ticket = params.ticket ?? "";
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  const prefs = profile.preferences;
  const preferenceMatch =
    tab === "recommended"
      ? {
          industries: (prefs?.sectors as string[]) ?? [],
          countries: (prefs?.countries as string[]) ?? [],
          stages: (prefs?.stages as string[]) ?? [],
        }
      : undefined;

  const hasPreferences =
    !!preferenceMatch &&
    (preferenceMatch.industries.length > 0 || preferenceMatch.countries.length > 0 || preferenceMatch.stages.length > 0);

  const where = buildStartupWhere(
    { q, industries, countries, stages, ticket },
    tab === "recommended" && hasPreferences ? preferenceMatch : undefined
  );

  const [startups, total] = await Promise.all([
    prisma.startup.findMany({
      where,
      orderBy: { approvedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.startup.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const buildHref = (p: number) => {
    const qs = new URLSearchParams();
    qs.set("tab", tab);
    if (q) qs.set("q", q);
    industries.forEach((i) => qs.append("industry", i));
    countries.forEach((c) => qs.append("country", c));
    stages.forEach((s) => qs.append("stage", s));
    if (ticket) qs.set("ticket", ticket);
    qs.set("page", String(p));
    return `/investor?${qs.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ink">Discover Startups</h1>
      </div>

      {params.submitted && (
        <Alert tone="success">Thanks &mdash; your investor profile has been submitted for review.</Alert>
      )}

      <div className="flex gap-2">
        <TabLink href="/investor?tab=recommended" active={tab === "recommended"}>
          Startups for you
        </TabLink>
        <TabLink href="/investor?tab=all" active={tab === "all"}>
          All Startups
        </TabLink>
      </div>

      <StartupFilterBar tab={tab} q={q} industries={industries} countries={countries} stages={stages} ticket={ticket} />

      {tab === "recommended" && !hasPreferences && (
        <Alert tone="info">
          Set your sectors, countries and stages on your{" "}
          <Link href="/investor/profile" className="underline">
            profile
          </Link>{" "}
          to see startups matched to your preferences. Showing all approved startups for now.
        </Alert>
      )}

      {startups.length === 0 ? (
        <EmptyState
          title="No startups match your current filters."
          description="Try changing your sector, country or funding stage."
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {startups.map((s) => (
              <StartupCard key={s.id} startup={s} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} buildHref={buildHref} />
        </>
      )}
    </div>
  );
}

function TabLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm font-medium",
        active ? "border-ink bg-ink text-white" : "border-border text-ink-soft hover:text-ink"
      )}
    >
      {children}
    </Link>
  );
}
