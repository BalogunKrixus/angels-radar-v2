import type { Prisma } from "@prisma/client";
import { TICKET_RANGE_BOUNDS } from "@/lib/constants";

export interface StartupFilters {
  q?: string;
  industries: string[];
  countries: string[];
  stages: string[];
  ticket?: string;
}

export function buildStartupWhere(
  filters: StartupFilters,
  preferenceMatch?: { industries: string[]; countries: string[]; stages: string[] }
): Prisma.StartupWhereInput {
  const and: Prisma.StartupWhereInput[] = [{ status: "approved" }];

  if (filters.q) {
    and.push({
      OR: [
        { name: { contains: filters.q } },
        { tagline: { contains: filters.q } },
        { description: { contains: filters.q } },
        { industry: { contains: filters.q } },
      ],
    });
  }

  if (filters.industries.length) and.push({ industry: { in: filters.industries } });
  if (filters.countries.length) and.push({ country: { in: filters.countries } });
  if (filters.stages.length) and.push({ stage: { in: filters.stages } });

  if (filters.ticket && TICKET_RANGE_BOUNDS[filters.ticket]) {
    const { min, max } = TICKET_RANGE_BOUNDS[filters.ticket];
    and.push({ amountRaising: { gte: min, ...(max !== undefined ? { lt: max } : {}) } });
  }

  if (preferenceMatch) {
    const or: Prisma.StartupWhereInput[] = [];
    if (preferenceMatch.industries.length) or.push({ industry: { in: preferenceMatch.industries } });
    if (preferenceMatch.countries.length) or.push({ country: { in: preferenceMatch.countries } });
    if (preferenceMatch.stages.length) or.push({ stage: { in: preferenceMatch.stages } });
    if (or.length) and.push({ OR: or });
  }

  return { AND: and };
}
