import { z } from "zod";

export const validateEmail = <T>(value: T) => {
  const schema = z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email({ message: "Please enter a valid email." });

  const result = schema.safeParse(value);

  return result.success
    ? []
    : result.error.issues.map((issue) => issue.message);
};
