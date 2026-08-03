import { z } from "zod";

export const validateYear = (value: string, minAge?: number): string[] => {
  const currentYear = new Date().getFullYear();

  const isArtistBirthYear = minAge !== undefined;
  const maxAllowedYear =
    isArtistBirthYear && minAge !== undefined
      ? currentYear - minAge
      : currentYear;

  let schema: z.ZodType<string, any, string> = z
    .string()
    .min(4, { message: "Year must be exactly 4 digits." })
    .max(4, { message: "Year must be exactly 4 digits." })
    .regex(/^\d{4}$/, {
      message: "Please enter a valid 4-digit year.",
    })
    .refine(
      (val) => Number.parseInt(val) >= (isArtistBirthYear ? 1900 : 1000),
      {
        message: isArtistBirthYear
          ? "Birth year must be 1900 or later."
          : "Year must be 1000 or later.",
      }
    )
    .refine((val) => Number.parseInt(val) <= maxAllowedYear, {
      message: isArtistBirthYear
        ? `Birth year must be ${maxAllowedYear} or earlier.`
        : `Year cannot be in the future (max ${currentYear}).`,
    });

  if (minAge !== undefined) {
    schema = schema.refine(
      (val) => currentYear - Number.parseInt(val) >= minAge,
      {
        message: `Artist must be at least ${minAge} years old.`,
      }
    );
  }

  const result = schema.safeParse(value);

  return result.success ? [] : result.error.errors.map((err) => err.message);
};
