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

function extractId(
  d: Record<string, unknown>,
  idKey: string,
): string | undefined {
  const val = d[idKey];
  if (typeof val === "string") return val;
  if (typeof d.user_id === "string") return d.user_id;
  if (typeof d.gallery_id === "string") return d.gallery_id;
  if (typeof d.artist_id === "string") return d.artist_id;
  if (typeof d.id === "string") return d.id;
  return undefined;
}

function extractEmail(
  d: Record<string, unknown>,
  b: Record<string, unknown>,
): string | undefined {
  if (typeof d.email === "string") return d.email;
  if (typeof b.email === "string") return b.email;
  return undefined;
}

function extractVerified(
  d: Record<string, unknown>,
  b: Record<string, unknown>,
): boolean | undefined {
  if (typeof d.verified === "boolean") return d.verified;
  if (typeof b.verified === "boolean") return b.verified;
  return undefined;
}

function parseDataRecord(
  rawData: Record<string, unknown>,
  b: Record<string, unknown>,
  idKey: string,
): RegistrationAnalyticsResponse {
  const id = extractId(rawData, idKey);
  const email = extractEmail(rawData, b);
  const verified = extractVerified(rawData, b);

  return {
    ...(id ? { id } : {}),
    ...(email ? { email } : {}),
    ...(typeof verified === "boolean" ? { verified } : {}),
  };
}

function parseStringData(
  rawData: string,
  b: Record<string, unknown>,
): RegistrationAnalyticsResponse {
  return {
    id: rawData,
    ...(typeof b.email === "string" ? { email: b.email } : {}),
    ...(typeof b.verified === "boolean" ? { verified: b.verified } : {}),
  };
}

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
    return parseStringData(rawData, b);
  }

  if (rawData && typeof rawData === "object" && !Array.isArray(rawData)) {
    return parseDataRecord(rawData as Record<string, unknown>, b, idKey);
  }

  const val = b[idKey];
  const topId = typeof val === "string" ? val : (typeof b.id === "string" ? b.id : undefined);
 
  return {
    ...(topId ? { id: topId } : {}),
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
