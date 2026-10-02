const ACCOUNT_TYPE_LABEL: Record<DeepLinkAppRole, string> = {
  individual: "collector",
  artist: "artist",
  gallery: "gallery",
};

export const deepLinkWrongAccountMessage = (
  required: DeepLinkAppRole,
  current: DeepLinkAppRole,
): string =>
  `This link is for ${ACCOUNT_TYPE_LABEL[required]} accounts. You are signed in as a ${ACCOUNT_TYPE_LABEL[current]} account. Sign out and sign in with the correct account to open this page.`;

export const wrongAccountFallback = (
  requiredRole: DeepLinkAppRole,
  currentRole: DeepLinkAppRole,
): DeepLinkFallback => ({
  type: "fallback",
  reason: "wrong_account",
  requiredRole,
  currentRole,
  appRole: currentRole,
});
