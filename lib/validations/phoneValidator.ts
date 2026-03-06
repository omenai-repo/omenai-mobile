import { z } from "zod";

const phoneSchema = z
  .string({ required_error: "Phone number is required" })
  .min(1, "Phone number is required")
  .refine(
    (val) => {
      // Remove spaces or hyphens that users might naturally type
      const cleanPhone = val.replace(/[\s-]/g, "");
      // - Starts with optional '+'
      // - Contains between 7 and 15 digits total
      // - Disallows obviously fake combinations like "+000" or entirely zeroes
      return /^\+?[1-9]\d{6,14}$/.test(cleanPhone);
    },
    { message: "Please enter a valid phone number (e.g. +1234567890)" },
  );

export function validatePhone(phone: string): string[] {
  const result = phoneSchema.safeParse(phone);

  if (!result.success) {
    return result.error.errors.map((err) => err.message);
  }

  return [];
}
