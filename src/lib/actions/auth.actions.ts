"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/password";
import { signIn, signOut, auth } from "@/auth";
import { logAnalyticsEvent } from "@/lib/analytics";

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const password = String(formData.get("password") ?? "");
  const callbackUrl = String(formData.get("callbackUrl") ?? "");

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || undefined,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      const params = new URLSearchParams({ error: "invalid" });
      if (callbackUrl) params.set("callbackUrl", callbackUrl);
      redirect(`/login?${params.toString()}`);
    }
    throw error;
  }
}

const signupSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
  role: z.enum(["founder", "investor"]),
});

export async function signupAction(formData: FormData) {
  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    redirect(`/signup?role=${formData.get("role") ?? "founder"}&error=invalid`);
  }

  const { email, password, role } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    redirect(`/signup?role=${role}&error=exists`);
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      passwordHash,
      role,
      ...(role === "founder"
        ? { founderProfile: { create: { fullName: "" } } }
        : {
            investorProfile: {
              create: {
                fullName: "",
                investorType: "angel",
                country: "",
                status: "draft",
                preferences: { create: {} },
              },
            },
          }),
    },
  });

  await logAnalyticsEvent("account_created", user.id, { role });

  await signIn("credentials", {
    email: normalizedEmail,
    password,
    redirectTo: role === "founder" ? "/founder" : "/investor",
  });
}

export async function changePasswordAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const accountPath = String(formData.get("accountPath") ?? "/");
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");

  if (newPassword.length < 8) {
    redirect(`${accountPath}?error=weak`);
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/login");

  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) {
    redirect(`${accountPath}?error=invalid`);
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

  redirect(`${accountPath}?success=1`);
}
