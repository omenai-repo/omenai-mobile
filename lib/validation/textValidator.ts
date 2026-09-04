import { z } from "zod";

export const validateText = <T>(value: T) => {
  const schema = z.string();
  let errors = [];

  if (!schema.min(3).safeParse(value).success) {
    errors.push("Must be at least 3 characters.");
  }
  return errors;
};
