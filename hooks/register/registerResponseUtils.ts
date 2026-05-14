const REGISTRATION_ACCOUNT_ID_KEY = {
  individual: "user_id",
  gallery: "gallery_id",
  artist: "artist_id",
} as const;

export type RegistrationAnalyticsResponse = {
  id?: string;
  email?: string;
  verified?: boolean;
};

/** API `body` (parsed JSON) → only id, email, verified for analytics. */
export function registrationResponseForAnalytics(
  body: unknown,
  accountType: UserType,
): RegistrationAnalyticsResponse {
  if (!body || typeof body !== "object") return {};

  const b = body as Record<string, unknown>;
  const idKey = REGISTRATION_ACCOUNT_ID_KEY[accountType];
  const rawData = b.data;

  if (typeof rawData === "string") {
    return {
      id: rawData,
      ...(typeof b.email === "string" ? { email: b.email } : {}),
      ...(typeof b.verified === "boolean" ? { verified: b.verified } : {}),
    };
  }

  if (rawData && typeof rawData === "object" && !Array.isArray(rawData)) {
    const d = rawData as Record<string, unknown>;
    const id =
      (typeof d[idKey] === "string" && d[idKey]) ||
      (typeof d.user_id === "string" && d.user_id) ||
      (typeof d.gallery_id === "string" && d.gallery_id) ||
      (typeof d.artist_id === "string" && d.artist_id) ||
      (typeof d.id === "string" && d.id) ||
      undefined;
    const email =
      (typeof d.email === "string" && d.email) ||
      (typeof b.email === "string" && b.email) ||
      undefined;
    const verified =
      typeof d.verified === "boolean"
        ? d.verified
        : typeof b.verified === "boolean"
          ? b.verified
          : undefined;

    return {
      ...(id ? { id } : {}),
      ...(email ? { email } : {}),
      ...(typeof verified === "boolean" ? { verified } : {}),
    };
  }

  const topId =
    (typeof b[idKey] === "string" && b[idKey]) ||
    (typeof b.id === "string" && b.id) ||
    undefined;

  return {
    ...(topId ? { id: topId as string } : {}),
    ...(typeof b.email === "string" ? { email: b.email } : {}),
    ...(typeof b.verified === "boolean" ? { verified: b.verified } : {}),
  };
}

/** Resolves verify-email screen `account.id` from a successful register API body. */
export function extractVerifyEmailIdFromRegisterBody(
  body: unknown,
  accountType: UserType,
): string | null {
  const { id } = registrationResponseForAnalytics(body, accountType);
  return typeof id === "string" && id.length > 0 ? id : null;
}
