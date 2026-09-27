import type { Startup } from "@prisma/client";
import { startupDraftSchema } from "@/lib/validation/startup";
import { saveUpload, deleteUpload } from "@/lib/storage";

export function fileOrNull(formData: FormData, field: string): File | null {
  const value = formData.get(field);
  if (value instanceof File && value.size > 0 && value.name) return value;
  return null;
}

function zipRows<T extends Record<string, string[]>>(fields: T, requiredKey: keyof T) {
  const length = fields[requiredKey].length;
  const rows: Record<keyof T, string>[] = [];
  for (let i = 0; i < length; i++) {
    const row = {} as Record<keyof T, string>;
    for (const key of Object.keys(fields) as (keyof T)[]) {
      row[key] = (fields[key][i] ?? "").trim();
    }
    if (row[requiredKey]) rows.push(row);
  }
  return rows;
}

export function parseStartupFields(formData: FormData) {
  const raw = {
    name: formData.get("name"),
    tagline: formData.get("tagline"),
    description: formData.get("description"),
    website: formData.get("website"),
    country: formData.get("country"),
    city: formData.get("city"),
    industry: formData.get("industry"),
    foundedYear: formData.get("foundedYear") || undefined,
    problem: formData.get("problem"),
    solution: formData.get("solution"),
    businessModel: formData.get("businessModel"),
    targetMarket: formData.get("targetMarket"),
    productDescription: formData.get("productDescription"),
    stage: formData.get("stage"),
    amountRaising: formData.get("amountRaising") || undefined,
    currency: formData.get("currency"),
    previousFunding: formData.get("previousFunding"),
    fundingUse: formData.get("fundingUse"),
    revenue: formData.get("revenue"),
    revenueRange: formData.get("revenueRange"),
    customerCount: formData.get("customerCount"),
    growthInfo: formData.get("growthInfo"),
    tractionNotes: formData.get("tractionNotes"),
    teamDescription: formData.get("teamDescription"),
  };

  return startupDraftSchema.safeParse(raw);
}

export function parseTeamRows(formData: FormData) {
  return zipRows(
    {
      name: formData.getAll("team_name").map(String),
      role: formData.getAll("team_role").map(String),
      bio: formData.getAll("team_bio").map(String),
      linkedin: formData.getAll("team_linkedin").map(String),
    },
    "name"
  );
}

export function parseLinkRows(formData: FormData) {
  return zipRows(
    {
      label: formData.getAll("link_label").map(String),
      url: formData.getAll("link_url").map(String),
    },
    "url"
  );
}

export async function handleStartupUploads(
  formData: FormData,
  existing: Startup | null,
  ownerId: string
) {
  let logoPath = existing?.logo ?? null;
  const logoFile = fileOrNull(formData, "logo");
  if (logoFile) {
    const newPath = await saveUpload("logos", ownerId, logoFile);
    if (existing?.logo) await deleteUpload(existing.logo);
    logoPath = newPath;
  }

  let deckPath = existing?.pitchDeckPath ?? null;
  let deckName = existing?.pitchDeckOriginalName ?? null;
  const deckFile = fileOrNull(formData, "pitchDeck");
  if (deckFile) {
    const newPath = await saveUpload("decks", ownerId, deckFile);
    if (existing?.pitchDeckPath) await deleteUpload(existing.pitchDeckPath);
    deckPath = newPath;
    deckName = deckFile.name;
  }

  return { logoPath, deckPath, deckName };
}
