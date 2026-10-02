import { z } from "zod";

const phoneSchema = z
  .string({ required_error: "Phone number is required" })
  .min(1, "Phone number is required")
  .refine(
    (val) => {
      // Remove spaces or hyphens that users might naturally type
      const cleanPhone = val.replaceAll(/[\s-]/g, "");
      // - Starts with '+' to require an international country code
      // - Contains between 10 and 15 digits total, including the country code
      // - Disallows obviously fake combinations like "+000" or entirely zeroes
      return /^\+[1-9]\d{9,14}$/.test(cleanPhone);
    },
    {
      message:
        "Please enter a valid phone number with country code (e.g. +1234567890)",
    },
  );

export function validatePhone(phone: string): string[] {
  const result = phoneSchema.safeParse(phone);

  if (!result.success) {
    return result.error.errors.map((err) => err.message);
  }

  return [];
}
