import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type AnalyticsEventType =
  | "account_created"
  | "profile_completed"
  | "startup_submitted"
  | "startup_approved"
  | "investor_approved"
  | "startup_viewed"
  | "introduction_requested";

export async function logAnalyticsEvent(
  type: AnalyticsEventType,
  userId?: string | null,
  metadata?: Record<string, unknown>
) {
  try {
    await prisma.analyticsEvent.create({
      data: {
        type,
        userId: userId ?? undefined,
        metadata: metadata ? (metadata as Prisma.InputJsonValue) : undefined,
      },
    });
  } catch (error) {
    // Analytics must never break the primary user flow.
    console.error("Failed to log analytics event", type, error);
  }
}
