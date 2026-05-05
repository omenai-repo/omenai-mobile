import { deeplinkScreensByRole } from "#config/deeplinkScreens";

type AppRole = "individual" | "artist" | "gallery";
type WebRole = "user" | "artist" | "gallery";
type LinkResolutionRole = AppRole | WebRole;

export type VerifiedDeepLinkPayload = {
  role: WebRole;
  route: string;
  payload: Record<string, unknown>;
  params: Record<string, string>;
};

const ROLE_TO_USER_TYPE: Record<
  AppRole,
  "user" | "artist" | "gallery"
> = {
  individual: "user",
  artist: "artist",
  gallery: "gallery",
};

const USER_TYPE_TO_ROLE: Record<
  "user" | "artist" | "gallery",
  AppRole
> = {
  user: "individual",
  artist: "artist",
  gallery: "gallery",
};

const FALLBACK_TARGET = "overview";

const DEEP_LINK_PATH_REGEX = /^\/?dl\/(individual|artist|gallery)(?:\/(.*))?$/i;
const SAFE_SEGMENT_REGEX = /^[a-z0-9_-]+$/i;
const SAFE_ARTWORK_ID_REGEX = /^[a-z0-9._:-]+$/i;
const SAFE_TOKEN_REGEX = /^[A-Za-z0-9._-]{16,512}$/;
const MAPPED_TARGETS_BY_ROLE: Record<AppRole, Set<string>> = {
  individual: new Set([
    "overview",
    "artworks",
    "search",
    "orders",
    "profile",
    "payment",
    "artwork",
  ]),
  artist: new Set(["overview", "artworks", "orders", "review", "profile", "artwork"]),
  gallery: new Set([
    "overview",
    "artworks",
    "orders",
    "billing",
    "payouts",
    "profile",
    "artwork",
  ]),
};

// Build a stricter, role-aware allowlist from the deeplink screens config
const ALLOWED_TARGETS_BY_ROLE: Record<AppRole, Set<string>> = {
  individual: new Set(
    (deeplinkScreensByRole.individual || []).map((r) => r.toLowerCase()),
  ),
  artist: new Set(
    (deeplinkScreensByRole.artist || []).map((r) => r.toLowerCase()),
  ),
  gallery: new Set(
    (deeplinkScreensByRole.gallery || []).map((r) => r.toLowerCase()),
  ),
};

const removeLeadingSlash = (value: string) => value.replace(/^\/+/, "");
const isWebRole = (value: unknown): value is WebRole =>
  value === "user" || value === "artist" || value === "gallery";

const toAppRole = (role: LinkResolutionRole): AppRole =>
  role === "user" ? "individual" : role;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const toStringMap = (value: unknown): Record<string, string> => {
  if (!isRecord(value)) return {};
  return Object.fromEntries(
    Object.entries(value)
      .filter((entry): entry is [string, string] => typeof entry[1] === "string")
      .map(([key, val]) => [key, val]),
  );
};

const parseRoleAndTargetFromPath = (path: string) => {
  const match = path.match(DEEP_LINK_PATH_REGEX);
  if (!match) return null;

  const role = match[1].toLowerCase() as AppRole;
  const target = removeLeadingSlash(match[2] ?? "").trim() || FALLBACK_TARGET;

  return { role, target };
};

const normalizeTarget = (target: string, role: AppRole) => {
  const segments = target
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (segments.length === 0) return FALLBACK_TARGET;

  const allowedForRole = ALLOWED_TARGETS_BY_ROLE[role] ?? new Set<string>();

  if (segments[0] === "artwork") {
    const artworkId = segments[1];
    if (!artworkId || segments.length !== 2) return FALLBACK_TARGET;
    if (!SAFE_ARTWORK_ID_REGEX.test(artworkId)) return FALLBACK_TARGET;
    // Ensure this role is allowed to deeplink into artwork
    if (!allowedForRole.has("artwork")) return FALLBACK_TARGET;
    return `artwork/${artworkId}`;
  }

  if (
    segments.length === 1 &&
    MAPPED_TARGETS_BY_ROLE[role].has(segments[0]) &&
    (allowedForRole.size === 0 || allowedForRole.has(segments[0]))
  ) {
    return segments[0];
  }

  return FALLBACK_TARGET;
};

export const sanitizeDeepLinkPath = (
  path: string,
  options: { isLoggedIn: boolean; userType?: string | null },
) => {
  const incomingPath = removeLeadingSlash(path);
  const parsed = parseRoleAndTargetFromPath(incomingPath);

  if (!parsed) return incomingPath;

  const { role, target } = parsed;
  const expectedUserType = ROLE_TO_USER_TYPE[role];
  const safeTarget = normalizeTarget(target, role);

  if (!options.isLoggedIn) {
    return "login";
  }

  if (
    options.userType &&
    options.userType in USER_TYPE_TO_ROLE &&
    options.userType !== expectedUserType
  ) {
    const safeRole = USER_TYPE_TO_ROLE[
      options.userType as keyof typeof USER_TYPE_TO_ROLE
    ];
    return `dl/${safeRole}/${FALLBACK_TARGET}`;
  }

  return `dl/${role}/${safeTarget}`;
};

export const extractSafeDeepLinkToken = (
  rawToken: unknown,
): string | undefined => {
  if (typeof rawToken !== "string") return undefined;
  const trimmed = rawToken.trim();
  if (!SAFE_TOKEN_REGEX.test(trimmed)) return undefined;
  return trimmed;
};

const normalizeRoleTargetPath = (
  role: LinkResolutionRole,
  targetPath: string,
  options: { isLoggedIn: boolean; userType?: string | null },
) => {
  const appRole = toAppRole(role);
  const target = removeLeadingSlash(targetPath).trim() || FALLBACK_TARGET;
  const safeTarget = normalizeTarget(target, appRole);
  return sanitizeDeepLinkPath(`dl/${appRole}/${safeTarget}`, options);
};

const normalizeWebPathFromToken = (
  payload: VerifiedDeepLinkPayload,
  options: { isLoggedIn: boolean; userType?: string | null },
) => {
  return normalizeRoleTargetPath(payload.role, payload.route, options);
};

export const parseVerifiedDeepLinkPayload = (
  rawValue: unknown,
): VerifiedDeepLinkPayload | null => {
  if (!isRecord(rawValue)) return null;

  const { role, route, payload, params } = rawValue;
  if (!isWebRole(role)) return null;
  if (typeof route !== "string" || !route.trim()) return null;
  if (!isRecord(payload)) return null;

  return {
    role,
    route: route.trim(),
    payload,
    params: toStringMap(params),
  };
};

export const normalizeIncomingDeepLinkPath = ({
  path,
  options,
  verifiedPayload,
  hasToken,
}: {
  path: string;
  options: { isLoggedIn: boolean; userType?: string | null };
  verifiedPayload?: VerifiedDeepLinkPayload | null;
  hasToken: boolean;
}) => {
  const incomingPath = removeLeadingSlash(path);

  if (verifiedPayload) {
    return normalizeWebPathFromToken(verifiedPayload, options);
  }

  const parsedLegacy = parseRoleAndTargetFromPath(incomingPath);
  if (parsedLegacy) {
    return sanitizeDeepLinkPath(incomingPath, options);
  }

  // Token-present links must be verified server-side before they can drive navigation.
  if (hasToken) {
    if (!options.isLoggedIn) return "login";
    if (
      options.userType &&
      options.userType in USER_TYPE_TO_ROLE
    ) {
      const safeRole = USER_TYPE_TO_ROLE[
        options.userType as keyof typeof USER_TYPE_TO_ROLE
      ];
      return `dl/${safeRole}/${FALLBACK_TARGET}`;
    }
    return `dl/individual/${FALLBACK_TARGET}`;
  }

  if (incomingPath === "login") return "login";
  return sanitizeDeepLinkPath(incomingPath, options);
};

export const buildAppUrlFromPathAndToken = (
  prefix: string,
  normalizedPath: string,
  token?: string,
) => {
  const tokenQuery = token ? `?token=${encodeURIComponent(token)}` : "";
  return `${prefix}${normalizedPath}${tokenQuery}`;
};
