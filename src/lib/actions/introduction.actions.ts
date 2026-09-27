"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAuthorizedUser } from "@/lib/session";
import { notifications } from "@/lib/email";
import { logAnalyticsEvent } from "@/lib/analytics";

export async function requestIntroductionAction(startupId: string, formData: FormData) {
  const user = await getAuthorizedUser("investor");
  if (!user) redirect("/login");

  const profile = await prisma.investorProfile.findUnique({ where: { userId: user.id } });
  if (!profile || profile.status !== "approved") redirect("/investor");

  const startup = await prisma.startup.findUnique({ where: { id: startupId } });
  if (!startup || startup.status !== "approved") redirect("/investor");

  const existing = await prisma.introductionRequest.findFirst({
    where: { startupId, investorId: profile.id, status: { in: ["new", "contacted"] } },
  });
  if (existing) redirect(`/investor/startups/${startupId}`);

  const investorNote = String(formData.get("investorNote") ?? "").trim() || null;

  await prisma.introductionRequest.create({
    data: { investorId: profile.id, startupId, investorNote },
  });

  await notifications.adminNewIntroductionRequest(
    profile.fullName,
    user.email ?? "",
    profile.organisation,
    startup.name
  );
  await logAnalyticsEvent("introduction_requested", user.id, { startupId, investorId: profile.id });

  redirect(`/investor/startups/${startupId}?requested=1`);
}
