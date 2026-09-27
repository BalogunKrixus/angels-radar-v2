import { redirect } from "next/navigation";
import { requireFounderContext } from "@/lib/session";
import { StartupDetail } from "@/components/startup/StartupDetail";
import { LinkButton } from "@/components/ui/Button";
import { fileUrl } from "@/lib/file-url";

export default async function FounderStartupViewPage() {
  const { profile } = await requireFounderContext();
  const startup = profile?.startup;
  if (!startup) redirect("/founder/startup");

  const canEdit = startup.status === "draft" || startup.status === "changes_requested";

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ink">Your startup profile</h1>
        {canEdit && <LinkButton href="/founder/startup">Edit profile</LinkButton>}
      </div>
      <StartupDetail
        startup={startup}
        logoUrl={fileUrl(startup.logo)}
        pitchDeckUrl={fileUrl(startup.pitchDeckPath)}
        showStatus
      />
    </div>
  );
}
