"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAuthorizedUser } from "@/lib/session";
import { notifications } from "@/lib/email";
import { logAnalyticsEvent } from "@/lib/analytics";
import { STARTUP_STATUSES, INVESTOR_STATUSES, INTRO_STATUSES } from "@/lib/constants";
import { parseStartupFields, parseTeamRows, parseLinkRows, handleStartupUploads } from "@/lib/startup-form";

async function requireAdmin() {
  const user = await getAuthorizedUser("admin");
  if (!user) redirect("/login");
  return user;
}

export async function adminUpdateStartupAction(startupId: string, formData: FormData) {
  await requireAdmin();

  const existing = await prisma.startup.findUnique({ where: { id: startupId } });
  if (!existing) redirect("/admin/startups");

  const parsed = parseStartupFields(formData);
  if (!parsed.success) {
    redirect(`/admin/startups/${startupId}/edit?error=validation`);
  }

  const { logoPath, deckPath, deckName } = await handleStartupUploads(formData, existing, existing.founderId);
  const teamRows = parseTeamRows(formData);
  const linkRows = parseLinkRows(formData);

  await prisma.startup.update({
    where: { id: startupId },
    data: {
      ...parsed.data,
      logo: logoPath,
      pitchDeckPath: deckPath,
      pitchDeckOriginalName: deckName,
    },
  });

  await prisma.teamMember.deleteMany({ where: { startupId } });
  if (teamRows.length) {
    await prisma.teamMember.createMany({ data: teamRows.map((r) => ({ ...r, startupId })) });
  }

  await prisma.link.deleteMany({ where: { startupId } });
  if (linkRows.length) {
    await prisma.link.createMany({ data: linkRows.map((r) => ({ ...r, startupId })) });
  }

  redirect(`/admin/startups/${startupId}?saved=1`);
}

export async function updateStartupStatusAction(formData: FormData) {
  await requireAdmin();

  const startupId = String(formData.get("startupId") ?? "");
  const status = String(formData.get("status") ?? "");
  const adminNote = String(formData.get("adminNote") ?? "").trim() || null;

  if (!STARTUP_STATUSES.includes(status as (typeof STARTUP_STATUSES)[number])) {
    redirect(`/admin/startups/${startupId}?error=invalid`);
  }

  const startup = await prisma.startup.update({
    where: { id: startupId },
    data: {
      status,
      adminNote,
      approvedAt: status === "approved" ? new Date() : undefined,
    },
    include: { founder: { include: { user: true } } },
  });

  const founderEmail = startup.founder.user.email;

  if (status === "approved") {
    await notifications.startupApproved(founderEmail, startup.name);
    await logAnalyticsEvent("startup_approved", startup.founder.userId, { startupId: startup.id });
  } else if (status === "changes_requested") {
    await notifications.startupChangesRequested(founderEmail, startup.name, adminNote);
  } else if (status === "rejected") {
    await notifications.startupRejected(founderEmail, startup.name, adminNote);
  }

  redirect(`/admin/startups/${startupId}?updated=1`);
}

export async function updateInvestorStatusAction(formData: FormData) {
  await requireAdmin();

  const investorId = String(formData.get("investorId") ?? "");
  const status = String(formData.get("status") ?? "");
  const adminNote = String(formData.get("adminNote") ?? "").trim() || null;

  if (!INVESTOR_STATUSES.includes(status as (typeof INVESTOR_STATUSES)[number])) {
    redirect(`/admin/investors/${investorId}?error=invalid`);
  }

  const investor = await prisma.investorProfile.update({
    where: { id: investorId },
    data: {
      status,
      adminNote,
      approvedAt: status === "approved" ? new Date() : undefined,
    },
    include: { user: true },
  });

  // Suspending an investor also blocks login outright; any other status keeps the account usable.
  await prisma.user.update({
    where: { id: investor.userId },
    data: { status: status === "suspended" ? "suspended" : "active" },
  });

  if (status === "approved") {
    await notifications.investorApproved(investor.user.email);
    await logAnalyticsEvent("investor_approved", investor.userId, { investorId: investor.id });
  } else if (status === "changes_requested") {
    await notifications.investorChangesRequested(investor.user.email, adminNote);
  } else if (status === "rejected") {
    await notifications.investorRejected(investor.user.email, adminNote);
  }

  redirect(`/admin/investors/${investorId}?updated=1`);
}

export async function updateIntroductionStatusAction(formData: FormData) {
  await requireAdmin();

  const introId = String(formData.get("introId") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!INTRO_STATUSES.includes(status as (typeof INTRO_STATUSES)[number])) {
    redirect("/admin/introductions?error=invalid");
  }

  await prisma.introductionRequest.update({ where: { id: introId }, data: { status } });

  redirect("/admin/introductions?updated=1");
}
