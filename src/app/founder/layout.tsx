import { requireRole } from "@/lib/session";
import { AppShell } from "@/components/layout/AppShell";

export default async function FounderLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole("founder");

  return (
    <AppShell
      primaryNav={[
        { href: "/founder", label: "My Startup" },
        { href: "/founder/profile", label: "My Profile" },
      ]}
      secondaryHref="/founder/account"
      secondaryLabel="Account"
      email={user.email ?? ""}
    >
      {children}
    </AppShell>
  );
}
