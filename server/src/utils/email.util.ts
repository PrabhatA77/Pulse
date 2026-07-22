import { Resend } from "resend";
import { env } from "../config/env.js";

const resend = new Resend(env.resendApiKey);

export async function sendOtpEmail(
  to: string,
  otp: string,
  purpose: "verify" | "reset",
) {
  const subject =
    purpose === "verify" ? "Verify your Email" : "Reset your password";

  const heading =
    purpose === "verify" ? "Confirm your email address" : "Reset your password";

  await resend.emails.send({
    from: env.emailFrom,
    to,
    subject,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2>${heading}</h2>
        <p>Your one-time code is:</p>
        <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px;">${otp}</p>
        <p>This code expires in 10 minutes. If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
}
