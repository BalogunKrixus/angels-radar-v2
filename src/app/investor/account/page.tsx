import { requireRole } from "@/lib/session";
import { AccountSettingsCard } from "@/components/account/AccountSettingsCard";

export default async function InvestorAccountPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const user = await requireRole("investor");
  const { error, success } = await searchParams;

  return (
    <AccountSettingsCard
      email={user.email ?? ""}
      accountPath="/investor/account"
      error={error}
      success={success}
    />
  );
}
