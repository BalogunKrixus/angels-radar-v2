import { notFound } from "next/navigation";
import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { StartupFormFields } from "@/components/startup/StartupFormFields";
import { adminUpdateStartupAction } from "@/lib/actions/admin.actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { LinkButton } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export default async function AdminEditStartupPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireRole("admin");
  const { id } = await params;
  const { error } = await searchParams;

  const startup = await prisma.startup.findUnique({
    where: { id },
    include: { teamMembers: true, links: true },
  });
  if (!startup) notFound();

  const action = adminUpdateStartupAction.bind(null, startup.id);

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ink">Edit {startup.name}</h1>
        <LinkButton href={`/admin/startups/${startup.id}`} variant="ghost" size="sm">
          Cancel
        </LinkButton>
      </div>

      {error && <Alert tone="danger">Please check the highlighted fields and try again.</Alert>}

      <form action={action} className="space-y-6">
        <StartupFormFields startup={startup} />
        <div className="pb-10">
          <SubmitButton pendingText="Saving…">Save changes</SubmitButton>
        </div>
      </form>
    </div>
  );
}
