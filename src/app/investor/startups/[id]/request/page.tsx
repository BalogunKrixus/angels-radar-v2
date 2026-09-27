import { notFound, redirect } from "next/navigation";
import { requireInvestorContext } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { requestIntroductionAction } from "@/lib/actions/introduction.actions";
import { Card } from "@/components/ui/Card";
import { Textarea, FormField } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { LinkButton } from "@/components/ui/Button";

export default async function RequestIntroductionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { profile } = await requireInvestorContext();
  if (!profile || profile.status !== "approved") redirect("/investor");

  const { id } = await params;
  const startup = await prisma.startup.findUnique({ where: { id } });
  if (!startup || startup.status !== "approved") notFound();

  const existing = await prisma.introductionRequest.findFirst({
    where: { startupId: id, investorId: profile.id, status: { in: ["new", "contacted"] } },
  });
  if (existing) redirect(`/investor/startups/${id}`);

  const action = requestIntroductionAction.bind(null, id);

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <h1 className="text-lg font-semibold text-ink">Request an introduction</h1>
        <p className="mt-2 text-sm text-ink">
          You are requesting an introduction to <span className="font-medium">{startup.name}</span>.
        </p>
        <p className="mt-2 text-sm text-ink-soft">
          AngelsRadar will receive your request and follow up with you regarding the introduction.
        </p>

        <form action={action} className="mt-5 space-y-4">
          <FormField label="Note (optional)" htmlFor="investorNote">
            <Textarea id="investorNote" name="investorNote" rows={3} />
          </FormField>
          <div className="flex items-center gap-3">
            <SubmitButton pendingText="Sending…">Request Introduction</SubmitButton>
            <LinkButton href={`/investor/startups/${id}`} variant="ghost">
              Cancel
            </LinkButton>
          </div>
        </form>
      </Card>
    </div>
  );
}
