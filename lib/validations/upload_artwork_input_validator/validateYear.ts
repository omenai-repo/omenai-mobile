import { z } from "zod";

export const validateYear = (value: string, minAge?: number): string[] => {
  const currentYear = new Date().getFullYear();

  let schema: z.ZodType<string, any, string> = z
    .string()
    .min(4, { message: "Year must be 4 digits." })
    .max(4, { message: "Year must be 4 digits." })
    .regex(/^\d{4}$/, {
      message: "Invalid year format. Please enter a four-digit number.",
    })
    .refine((val) => Number.parseInt(val) <= currentYear, {
      message: `Year must not be greater than ${currentYear}.`,
    });

  if (minAge !== undefined) {
    schema = schema.refine(
      (val) => currentYear - Number.parseInt(val) >= minAge,
      {
        message: `Minimum ${minAge} years.`,
      },
    );
  }

  const result = schema.safeParse(value);

  return result.success ? [] : result.error.errors.map((err) => err.message);
};
