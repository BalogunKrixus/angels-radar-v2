import { requireRole } from "@/lib/session";
import { AccountSettingsCard } from "@/components/account/AccountSettingsCard";

export default async function FounderAccountPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const user = await requireRole("founder");
  const { error, success } = await searchParams;

  return (
    <AccountSettingsCard
      email={user.email ?? ""}
      accountPath="/founder/account"
      error={error}
      success={success}
    />
  );
}
