/** Higher priority wins when multiple resolves race; avoids overview overwriting a real target. */
export function deepLinkResultPriority(result: DeepLinkResolveResult): number {
  if (result.type === "navigate") return 4;
  if (result.type === "fallback") {
    if (result.reason === "wrong_account") return 3;
    if (result.reason === "login") return 3;
    if (result.reason === "overview") return 2;
    if (result.reason === "verify_failed") return 1;
  }
  return 0;
}

export function shouldReplacePendingResult(
  current: DeepLinkResolveResult | null,
  incoming: DeepLinkResolveResult,
): boolean {
  if (!current) return true;
  return deepLinkResultPriority(incoming) >= deepLinkResultPriority(current);
}
