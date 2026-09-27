import { redirect } from "next/navigation";
import { requireFounderContext } from "@/lib/session";
import { saveStartupAction } from "@/lib/actions/startup.actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Alert } from "@/components/ui/Alert";
import { StartupFormFields } from "@/components/startup/StartupFormFields";

const ERROR_MESSAGES: Record<string, string> = {
  validation: "Please check the highlighted fields and try again.",
  incomplete: "Add a one-line description, full description, country and industry before submitting.",
  locked: "This startup is currently under review and can't be edited right now.",
};

export default async function StartupFormPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { profile } = await requireFounderContext();
  const { error, saved } = await searchParams;
  const startup = profile?.startup ?? null;

  if (startup && (startup.status === "pending" || startup.status === "rejected")) {
    redirect("/founder/startup/view");
  }

  const isResubmit = startup?.status === "changes_requested";

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">
          {startup ? "Edit your startup profile" : "Create your startup profile"}
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          Tell investors what you&apos;re building. You can save a draft and come back anytime.
        </p>
      </div>

      <div className="space-y-2">
        {error && <Alert tone="danger">{ERROR_MESSAGES[error] ?? "Something went wrong."}</Alert>}
        {saved && <Alert tone="success">Your changes have been saved.</Alert>}
        {startup?.status === "changes_requested" && startup.adminNote && (
          <Alert tone="warning">
            <span className="font-medium">AngelsRadar requested changes:</span> {startup.adminNote}
          </Alert>
        )}
      </div>

      <form action={saveStartupAction} className="space-y-6">
        <StartupFormFields startup={startup} />

        <div className="flex items-center gap-3 pb-10">
          <SubmitButton name="intent" value="draft" variant="secondary" pendingText="Saving…">
            Save draft
          </SubmitButton>
          <SubmitButton name="intent" value="submit" pendingText="Submitting…">
            {isResubmit ? "Resubmit for review" : "Submit for review"}
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
