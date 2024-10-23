export const utils_trimWhiteSpace = (s: string) => {
  const trimmedString: string = s.replace(/\s+/g, " ").trim();

  return trimmedString;
};
