// Thin email abstraction. In development (no RESEND_API_KEY set) it logs the
// email to the console instead of sending it, so the app runs fully without
// any external account. Set RESEND_API_KEY + EMAIL_FROM to send for real.

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM ?? "AngelsRadar <notifications@angelsradar.dev>";
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL ?? "admin@angelsradar.dev";

interface SendEmailInput {
  to: string;
  subject: string;
  body: string;
}

async function sendEmail({ to, subject, body }: SendEmailInput) {
  if (!RESEND_API_KEY) {
    console.log(`\n[DEV EMAIL] to=${to} subject="${subject}"\n${body}\n`);
    return;
  }

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to,
        subject,
        text: body,
      }),
    });
  } catch (error) {
    console.error("Failed to send email", error);
  }
}

export const notifications = {
  passwordReset: (to: string, resetUrl: string) =>
    sendEmail({
      to,
      subject: "Reset your AngelsRadar password",
      body: `We received a request to reset your AngelsRadar password. Use the link below — it expires in 1 hour.\n\n${resetUrl}\n\nIf you didn't request this, you can safely ignore this email.`,
    }),

  startupApproved: (to: string, startupName: string) =>
    sendEmail({
      to,
      subject: "Your startup has been approved on AngelsRadar",
      body: `Good news — ${startupName} has been approved and is now visible to approved investors on AngelsRadar.`,
    }),

  startupChangesRequested: (to: string, startupName: string, note?: string | null) =>
    sendEmail({
      to,
      subject: "Updates requested for your AngelsRadar startup profile",
      body: `AngelsRadar has requested some changes to ${startupName} before it can be approved.${
        note ? `\n\nNote from the AngelsRadar team:\n${note}` : ""
      }\n\nLog in to update your profile and resubmit.`,
    }),

  startupRejected: (to: string, startupName: string, note?: string | null) =>
    sendEmail({
      to,
      subject: "Update on your AngelsRadar startup submission",
      body: `Thanks for submitting ${startupName} to AngelsRadar. After review, we're not able to approve this profile at this time.${
        note ? `\n\n${note}` : ""
      }`,
    }),

  investorApproved: (to: string) =>
    sendEmail({
      to,
      subject: "You're approved on AngelsRadar",
      body: `Your investor account has been approved. Log in to start discovering African startups.`,
    }),

  investorChangesRequested: (to: string, note?: string | null) =>
    sendEmail({
      to,
      subject: "Updates requested for your AngelsRadar investor profile",
      body: `AngelsRadar has requested some changes to your investor profile before it can be approved.${
        note ? `\n\nNote from the AngelsRadar team:\n${note}` : ""
      }\n\nLog in to update your profile and resubmit.`,
    }),

  investorRejected: (to: string, note?: string | null) =>
    sendEmail({
      to,
      subject: "Update on your AngelsRadar investor application",
      body: `Thanks for applying to join AngelsRadar. After review, we're not able to approve your investor profile at this time.${
        note ? `\n\n${note}` : ""
      }`,
    }),

  adminNewStartup: (startupName: string, founderEmail: string) =>
    sendEmail({
      to: ADMIN_EMAIL,
      subject: "New startup submitted for review",
      body: `${startupName} was just submitted by ${founderEmail} and is waiting for review.`,
    }),

  adminNewInvestor: (investorName: string, investorEmail: string) =>
    sendEmail({
      to: ADMIN_EMAIL,
      subject: "New investor submitted for review",
      body: `${investorName} (${investorEmail}) just submitted an investor profile and is waiting for review.`,
    }),

  adminNewIntroductionRequest: (investorName: string, investorEmail: string, investorOrg: string | null | undefined, startupName: string) =>
    sendEmail({
      to: ADMIN_EMAIL,
      subject: `New introduction request: ${startupName}`,
      body: `${investorName}${investorOrg ? ` (${investorOrg})` : ""} <${investorEmail}> has requested an introduction to ${startupName}.\n\nLog in to the admin introduction queue to follow up.`,
    }),
};
