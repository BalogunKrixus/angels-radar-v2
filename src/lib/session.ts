import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { Role } from "@/lib/constants";

/** For Server Components / pages. Redirects to /login (or the user's own area) rather than rendering. */
export async function requireRole(role: Role) {
  const session = await auth();
  if (!session?.user) redirect(`/login?callbackUrl=/${role}`);
  if (session.user.role !== role) redirect(`/${session.user.role}`);
  return session.user;
}

/** For server actions / route handlers, where redirect() is not appropriate. Returns null instead of throwing. */
export async function getAuthorizedUser(role: Role) {
  const session = await auth();
  if (!session?.user || session.user.role !== role) return null;
  return session.user;
}

export async function requireFounderContext() {
  const authUser = await requireRole("founder");
  const profile = await prisma.founderProfile.findUnique({
    where: { userId: authUser.id },
    include: { startup: { include: { teamMembers: true, links: true } } },
  });
  return { authUser, profile };
}

export async function requireInvestorContext() {
  const authUser = await requireRole("investor");
  const profile = await prisma.investorProfile.findUnique({
    where: { userId: authUser.id },
    include: { preferences: true },
  });
  return { authUser, profile };
}

export async function requireAdminContext() {
  const authUser = await requireRole("admin");
  return { authUser };
}
