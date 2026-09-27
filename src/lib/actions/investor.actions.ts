"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAuthorizedUser } from "@/lib/session";
import { investorProfileSchema, submitInvestorRequirementSchema } from "@/lib/validation/investor";
import { saveUpload, deleteUpload } from "@/lib/storage";
import { notifications } from "@/lib/email";
import { logAnalyticsEvent } from "@/lib/analytics";

function fileOrNull(formData: FormData, field: string): File | null {
  const value = formData.get(field);
  if (value instanceof File && value.size > 0 && value.name) return value;
  return null;
}

export async function investorProfileAction(formData: FormData) {
  const user = await getAuthorizedUser("investor");
  if (!user) redirect("/login");

  const existing = await prisma.investorProfile.findUnique({
    where: { userId: user.id },
    include: { preferences: true },
  });
  if (!existing) redirect("/login");

  if (existing.status === "pending" || existing.status === "rejected") {
    redirect("/investor/profile?error=locked");
  }

  const intent = String(formData.get("intent") ?? "draft"); // draft | submit

  const parsed = investorProfileSchema.safeParse({
    fullName: formData.get("fullName"),
    jobTitle: formData.get("jobTitle"),
    organisation: formData.get("organisation"),
    investorType: formData.get("investorType"),
    country: formData.get("country"),
    city: formData.get("city"),
    linkedin: formData.get("linkedin"),
    website: formData.get("website"),
    investmentThesis: formData.get("investmentThesis"),
  });

  if (!parsed.success) {
    redirect("/investor/profile?error=validation");
  }
  const data = parsed.data;

  if (intent === "submit") {
    const check = submitInvestorRequirementSchema.safeParse(data);
    if (!check.success) {
      redirect("/investor/profile?error=incomplete");
    }
  }

  let photoPath = existing.photo;
  const photoFile = fileOrNull(formData, "photo");
  if (photoFile) {
    const newPath = await saveUpload("avatars", user.id, photoFile);
    if (existing.photo) await deleteUpload(existing.photo);
    photoPath = newPath;
  }

  const sectors = formData.getAll("sectors").map(String);
  const countries = formData.getAll("countries").map(String);
  const stages = formData.getAll("stages").map(String);
  const ticketRanges = formData.getAll("ticketRanges").map(String);

  const nextStatus = intent === "submit" ? "pending" : existing.status;

  const updated = await prisma.investorProfile.update({
    where: { id: existing.id },
    data: {
      ...data,
      photo: photoPath,
      status: nextStatus,
      adminNote: intent === "submit" ? null : existing.adminNote,
      preferences: {
        upsert: {
          create: { sectors, countries, stages, ticketRanges },
          update: { sectors, countries, stages, ticketRanges },
        },
      },
    },
  });

  if (intent === "submit") {
    await notifications.adminNewInvestor(updated.fullName, user.email ?? "");
    await logAnalyticsEvent("profile_completed", user.id, { investorId: updated.id });
    redirect("/investor?submitted=1");
  }

  redirect("/investor/profile?saved=1");
}
