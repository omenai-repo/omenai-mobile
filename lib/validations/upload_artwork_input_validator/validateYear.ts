import { z } from 'zod';

export const validateYear = (value: string): string[] => {
  const currentYear = new Date().getFullYear();

  const schema = z
    .string()
    .min(4, { message: 'Year must be 4 digits.' })
    .max(4, { message: 'Year must be 4 digits.' })
    .regex(/^\d{4}$/, { message: 'Invalid year format. Please enter a four-digit number.' })
    .refine((val) => parseInt(val) <= currentYear, {
      message: `Year must not be greater than ${currentYear}.`,
    });

  const result = schema.safeParse(value);

  return result.success ? [] : result.error.errors.map((err) => err.message);
};
