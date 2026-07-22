import crypto from "crypto";
import bcrypt from "bcryptjs";

export function generateOtp(): string {
  return crypto.randomInt(100000, 99999).toString();
}

export async function hashOtp(otp: string): Promise<string> {
  return bcrypt.hash(otp, 10);
}

export async function compareOtp(
  candidate: string,
  hashed: string,
): Promise<boolean> {
  return bcrypt.compare(candidate, hashed);
}

export function otpExpiryDate(minutes = 10): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}
