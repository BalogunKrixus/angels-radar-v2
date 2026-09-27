import { requireRole } from "@/lib/session";
import { AppShell } from "@/components/layout/AppShell";

export default async function InvestorLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole("investor");

  return (
    <AppShell
      primaryNav={[
        { href: "/investor", label: "Discover Startups" },
        { href: "/investor/profile", label: "My Profile" },
      ]}
      secondaryHref="/investor/account"
      secondaryLabel="Account"
      email={user.email ?? ""}
    >
      {children}
    </AppShell>
  );
}
