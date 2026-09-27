import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";

export default async function AdminDashboardPage() {
  await requireRole("admin");

  const [pendingStartups, approvedStartups, pendingInvestors, approvedInvestors, newIntroductions] =
    await Promise.all([
      prisma.startup.count({ where: { status: "pending" } }),
      prisma.startup.count({ where: { status: "approved" } }),
      prisma.investorProfile.count({ where: { status: "pending" } }),
      prisma.investorProfile.count({ where: { status: "approved" } }),
      prisma.introductionRequest.count({ where: { status: "new" } }),
    ]);

  const stats = [
    { label: "Pending Startups", value: pendingStartups, href: "/admin/startups?status=pending" },
    { label: "Approved Startups", value: approvedStartups, href: "/admin/startups?status=approved" },
    { label: "Pending Investors", value: pendingInvestors, href: "/admin/investors?status=pending" },
    { label: "Approved Investors", value: approvedInvestors, href: "/admin/investors?status=approved" },
    { label: "New Introductions", value: newIntroductions, href: "/admin/introductions?status=new" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ink">AngelsRadar Admin</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <a key={stat.label} href={stat.href}>
            <Card className="h-full hover:border-accent/40 transition-colors">
              <p className="text-3xl font-semibold text-ink">{stat.value}</p>
              <p className="mt-1 text-sm text-ink-soft">{stat.label}</p>
            </Card>
          </a>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <LinkButton href="/admin/startups?status=pending" variant="secondary">
          Review pending startups
        </LinkButton>
        <LinkButton href="/admin/investors?status=pending" variant="secondary">
          Review pending investors
        </LinkButton>
        <LinkButton href="/admin/introductions?status=new" variant="secondary">
          View new introductions
        </LinkButton>
      </div>
    </div>
  );
}
