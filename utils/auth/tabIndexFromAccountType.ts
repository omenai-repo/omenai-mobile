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

/** `params.tab` or `params.account_type` from verify → Login `account_type`. Defaults to collector. */
export function loginAccountTypeFromParams(
  params: Record<string, string>,
): "individual" | "artist" | "gallery" {
  const raw = (params.tab ?? params.account_type ?? "").trim().toLowerCase();
  if (raw === "artist") return "artist";
  if (raw === "gallery") return "gallery";
  return "individual";
}
