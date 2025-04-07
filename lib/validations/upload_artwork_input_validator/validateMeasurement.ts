import { z } from 'zod';

export const validateMeasurement = (value: string): string[] => {
  const errors: string[] = [];

  // Define a Zod schema for numeric string (optional decimal)
  const schema = z.string().regex(/^\d+(\.\d+)?$/, {
    message: 'Invalid input. Only numeric values are allowed.',
  });

  // Run validation
  if (!schema.safeParse(value).success) {
    errors.push('Please enter a valid number (e.g., 24, 35.5, 440).');
  }

  return errors;
};
