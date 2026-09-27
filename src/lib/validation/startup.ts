import { z } from "zod";
import { STAGES } from "@/lib/constants";

const stageValues = STAGES.map((s) => s.value) as [string, ...string[]];

export const startupDraftSchema = z.object({
  name: z.string().trim().min(1, "Startup name is required").max(120),
  tagline: z.string().trim().max(160).optional().default(""),
  description: z.string().trim().max(4000).optional().default(""),
  website: z.string().trim().max(300).optional().default(""),
  country: z.string().trim().max(80).optional().default(""),
  city: z.string().trim().max(80).optional().default(""),
  industry: z.string().trim().max(80).optional().default(""),
  foundedYear: z.coerce.number().int().min(1900).max(2100).optional().nullable(),

  problem: z.string().trim().max(2000).optional().default(""),
  solution: z.string().trim().max(2000).optional().default(""),
  businessModel: z.string().trim().max(2000).optional().default(""),
  targetMarket: z.string().trim().max(2000).optional().default(""),
  productDescription: z.string().trim().max(2000).optional().default(""),

  stage: z.enum(stageValues).optional().default("pre_seed"),
  amountRaising: z.coerce.number().nonnegative().optional().nullable(),
  currency: z.string().trim().max(10).optional().default("USD"),
  previousFunding: z.string().trim().max(500).optional().default(""),
  fundingUse: z.string().trim().max(2000).optional().default(""),

  revenue: z.string().trim().max(200).optional().default(""),
  revenueRange: z.string().trim().max(80).optional().default(""),
  customerCount: z.string().trim().max(200).optional().default(""),
  growthInfo: z.string().trim().max(1000).optional().default(""),
  tractionNotes: z.string().trim().max(2000).optional().default(""),

  teamDescription: z.string().trim().max(2000).optional().default(""),
});

export const submitRequirementSchema = z.object({
  name: z.string().trim().min(1),
  tagline: z.string().trim().min(1, "A one-line description is required to submit."),
  description: z.string().trim().min(1, "A full description is required to submit."),
  country: z.string().trim().min(1, "Country is required to submit."),
  industry: z.string().trim().min(1, "Industry is required to submit."),
});
