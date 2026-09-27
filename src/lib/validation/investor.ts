import { z } from "zod";
import { INVESTOR_TYPES } from "@/lib/constants";

const investorTypeValues = INVESTOR_TYPES.map((t) => t.value) as [string, ...string[]];

export const investorProfileSchema = z.object({
  fullName: z.string().trim().max(120).optional().default(""),
  jobTitle: z.string().trim().max(120).optional().default(""),
  organisation: z.string().trim().max(160).optional().default(""),
  investorType: z.enum(investorTypeValues).optional().default("angel"),
  country: z.string().trim().max(80).optional().default(""),
  city: z.string().trim().max(80).optional().default(""),
  linkedin: z.string().trim().max(300).optional().default(""),
  website: z.string().trim().max(300).optional().default(""),
  investmentThesis: z.string().trim().max(2000).optional().default(""),
});

export const submitInvestorRequirementSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required to submit."),
  country: z.string().trim().min(1, "Country is required to submit."),
});
