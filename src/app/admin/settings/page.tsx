import { requireRole } from "@/lib/session";
import { AccountSettingsCard } from "@/components/account/AccountSettingsCard";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const user = await requireRole("admin");
  const { error, success } = await searchParams;

  return (
    <AccountSettingsCard
      email={user.email ?? ""}
      accountPath="/admin/settings"
      error={error}
      success={success}
    />
  );
}
