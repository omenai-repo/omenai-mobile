/** Maps deep-link / route `account_type` to Register / Login tab order: Collector, Artist, Gallery. */
export function tabIndexFromAccountType(
  accountType: string | undefined,
): number | null {
  const normalized = accountType?.trim().toLowerCase();
  if (normalized === "artist") return 1;
  if (normalized === "gallery") return 2;
  if (
    normalized === "individual" ||
    normalized === "collector" ||
    normalized === "user"
  ) {
    return 0;
  }
  return null;
}
