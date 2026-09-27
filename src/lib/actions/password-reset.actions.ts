"use server";

import crypto from "crypto";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { notifications } from "@/lib/email";

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function requestPasswordResetAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").toLowerCase().trim();

  if (email) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const rawToken = crypto.randomBytes(32).toString("hex");
      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          token: hashToken(rawToken),
          expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
        },
      });
      const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
      await notifications.passwordReset(user.email, `${baseUrl}/reset-password?token=${rawToken}`);
    }
  }

  // Always show the same message so we don't reveal whether an email is registered.
  redirect("/forgot-password?sent=1");
}

export async function resetPasswordAction(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!token || password.length < 8) {
    redirect(`/reset-password?token=${token}&error=invalid`);
  }

  const hashed = hashToken(token);
  const record = await prisma.passwordResetToken.findUnique({ where: { token: hashed } });

  if (!record || record.usedAt || record.expiresAt < new Date()) {
    redirect("/reset-password?error=expired");
  }

  const passwordHash = await hashPassword(password);

  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
  ]);

  redirect("/login?reset=1");
}
