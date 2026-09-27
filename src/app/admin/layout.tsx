import { requireRole } from "@/lib/session";
import { AppShell } from "@/components/layout/AppShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole("admin");

  return (
    <AppShell
      primaryNav={[
        { href: "/admin", label: "Dashboard" },
        { href: "/admin/startups", label: "Startups" },
        { href: "/admin/investors", label: "Investors" },
        { href: "/admin/introductions", label: "Introduction Requests" },
      ]}
      secondaryHref="/admin/settings"
      secondaryLabel="Settings"
      email={user.email ?? ""}
    >
      {children}
    </AppShell>
  );
}
