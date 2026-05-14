/** Maps deep-link / route `account_type` to Register / Login tab order: Collector, Artist, Gallery. */
export function tabIndexFromAccountType(
  accountType: string | undefined,
): number | null {
  if (accountType === "artist") return 1;
  if (accountType === "gallery") return 2;
  if (accountType === "individual") return 0;
  return null;
}
