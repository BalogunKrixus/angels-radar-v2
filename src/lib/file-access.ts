import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

/**
 * Authorization for the startup's private assets (logo, pitch deck):
 * the owning founder, an admin, or an approved investor viewing an
 * approved startup. Everyone else — including a logged-in founder who
 * isn't the owner — is denied, matching PRD section 30 (private by default)
 * and rule 10 (pitch decks must never be publicly accessible).
 */
export async function canAccessStartup(startupId: string): Promise<boolean> {
  const session = await auth();
  if (!session?.user) return false;

  if (session.user.role === "admin") return true;

  const startup = await prisma.startup.findUnique({
    where: { id: startupId },
    select: { status: true, founder: { select: { userId: true } } },
  });
  if (!startup) return false;

  if (session.user.role === "founder") {
    return startup.founder.userId === session.user.id;
  }

  if (session.user.role === "investor") {
    if (startup.status !== "approved") return false;
    const investor = await prisma.investorProfile.findUnique({
      where: { userId: session.user.id },
      select: { status: true },
    });
    return investor?.status === "approved";
  }

  return false;
}

/** Authorization for a founder/investor profile photo: the owner or an admin, or (for a founder's photo) an approved investor viewing the founder's approved startup. */
export async function canAccessAvatar(storagePath: string): Promise<boolean> {
  const session = await auth();
  if (!session?.user) return false;
  if (session.user.role === "admin") return true;

  const founder = await prisma.founderProfile.findFirst({
    where: { photo: storagePath },
    select: { userId: true, startup: { select: { status: true } } },
  });
  if (founder) {
    if (founder.userId === session.user.id) return true;
    if (session.user.role === "investor" && founder.startup?.status === "approved") {
      const investor = await prisma.investorProfile.findUnique({
        where: { userId: session.user.id },
        select: { status: true },
      });
      return investor?.status === "approved";
    }
    return false;
  }

  const investorProfile = await prisma.investorProfile.findFirst({
    where: { photo: storagePath },
    select: { userId: true },
  });
  if (investorProfile) {
    return investorProfile.userId === session.user.id;
  }

  return false;
}
