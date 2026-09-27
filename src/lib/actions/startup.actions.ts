"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAuthorizedUser } from "@/lib/session";
import { submitRequirementSchema } from "@/lib/validation/startup";
import { deleteUpload, saveUpload } from "@/lib/storage";
import { notifications } from "@/lib/email";
import { logAnalyticsEvent } from "@/lib/analytics";
import {
  fileOrNull,
  parseStartupFields,
  parseTeamRows,
  parseLinkRows,
  handleStartupUploads,
} from "@/lib/startup-form";

export async function saveStartupAction(formData: FormData) {
  const user = await getAuthorizedUser("founder");
  if (!user) redirect("/login");

  const founderProfile = await prisma.founderProfile.findUnique({
    where: { userId: user.id },
    include: { startup: true },
  });
  if (!founderProfile) redirect("/login");

  const existing = founderProfile.startup;

  // Editing is only allowed from draft, changes_requested or approved states —
  // not while pending review, and not once rejected (terminal for the MVP).
  if (existing && (existing.status === "pending" || existing.status === "rejected")) {
    redirect("/founder/startup?error=locked");
  }

  const intent = String(formData.get("intent") ?? "draft"); // draft | submit

  const parsed = parseStartupFields(formData);
  if (!parsed.success) {
    redirect("/founder/startup?error=validation");
  }
  const data = parsed.data;

  if (intent === "submit") {
    const submitCheck = submitRequirementSchema.safeParse(data);
    if (!submitCheck.success) {
      redirect("/founder/startup?error=incomplete");
    }
  }

  const { logoPath, deckPath, deckName } = await handleStartupUploads(
    formData,
    existing,
    founderProfile.id
  );
  const teamRows = parseTeamRows(formData);
  const linkRows = parseLinkRows(formData);

  const isFirstSubmit = intent === "submit" && (!existing || existing.status === "draft");
  const isResubmit = intent === "submit" && existing?.status === "changes_requested";

  let nextStatus = existing?.status ?? "draft";
  if (intent === "submit") nextStatus = "pending";

  const baseData = {
    ...data,
    logo: logoPath,
    pitchDeckPath: deckPath,
    pitchDeckOriginalName: deckName,
    status: nextStatus,
    adminNote: intent === "submit" ? null : existing?.adminNote,
    submittedAt: intent === "submit" ? new Date() : existing?.submittedAt,
  };

  const startup = existing
    ? await prisma.startup.update({ where: { id: existing.id }, data: baseData })
    : await prisma.startup.create({ data: { ...baseData, founderId: founderProfile.id } });

  await prisma.teamMember.deleteMany({ where: { startupId: startup.id } });
  if (teamRows.length) {
    await prisma.teamMember.createMany({
      data: teamRows.map((r) => ({ ...r, startupId: startup.id })),
    });
  }

  await prisma.link.deleteMany({ where: { startupId: startup.id } });
  if (linkRows.length) {
    await prisma.link.createMany({
      data: linkRows.map((r) => ({ ...r, startupId: startup.id })),
    });
  }

  if (intent === "submit") {
    await notifications.adminNewStartup(startup.name, user.email ?? "");
    await logAnalyticsEvent("startup_submitted", user.id, { startupId: startup.id });
    if (isFirstSubmit || isResubmit) {
      await logAnalyticsEvent("profile_completed", user.id, { startupId: startup.id });
    }
    redirect("/founder?submitted=1");
  }

  redirect("/founder/startup?saved=1");
}

export async function founderProfileAction(formData: FormData) {
  const user = await getAuthorizedUser("founder");
  if (!user) redirect("/login");

  const fullName = String(formData.get("fullName") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const linkedin = String(formData.get("linkedin") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!fullName) {
    redirect("/founder/profile?error=validation");
  }

  const existing = await prisma.founderProfile.findUnique({ where: { userId: user.id } });

  let photoPath = existing?.photo ?? null;
  const photoFile = fileOrNull(formData, "photo");
  if (photoFile) {
    const newPath = await saveUpload("avatars", user.id, photoFile);
    if (existing?.photo) await deleteUpload(existing.photo);
    photoPath = newPath;
  }

  await prisma.founderProfile.update({
    where: { userId: user.id },
    data: { fullName, title, linkedin, phone, photo: photoPath },
  });

  redirect("/founder/profile?saved=1");
}
