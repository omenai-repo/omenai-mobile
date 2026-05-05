import { z } from "zod";

const PASSWORD_SPECIAL_SET = new Set<string>([
  "@",
  "#",
  "$",
  "%",
  "^",
  "&",
  "+",
  "=",
  "!",
]);

const meetsComplexityRequirements = (s: string) =>
  /[A-Z]/.test(s) && /[a-z]/.test(s) && /\d/.test(s);

const hasSpecialChar = (s: string): boolean => {
  for (let i = 0; i < s.length; i += 1) {
    if (PASSWORD_SPECIAL_SET.has(s[i])) return true;
  }
  return false;
};

export const validatePassword = <T>(value: T) => {
  const schema = z.string();
  let errors = [];

  if (!schema.min(8).max(16).safeParse(value).success) {
    errors.push("Your password should be between 8 and 16 characters");
  }

  const s = typeof value === "string" ? value : "";

  if (!s || !meetsComplexityRequirements(s)) {
    errors.push(
      "Your password should contain at least one lowercase letter, one uppercase letter and one number",
    );
  }
  if (!s || !hasSpecialChar(s)) {
    errors.push(
      "At least one special character ( @ # $ % ^ & + = ! ) is required",
    );
  }

  return errors;
};
