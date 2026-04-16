import { deeplinkScreensByRole } from "#config/deeplinkScreens";

type AppRole = "individual" | "artist" | "gallery";

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
const ALLOWED_STATIC_TARGETS = new Set([
  "overview",
  "artworks",
  "search",
  "orders",
  "profile",
  "review",
  "billing",
  "payouts",
]);

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
    (ALLOWED_STATIC_TARGETS.has(segments[0]) ||
      allowedForRole.has(segments[0]))
  ) {
    return segments[0];
  }

  // Support backend-issued one-segment token links, but keep the character set strict.
  if (
    segments.length === 1 &&
    !ALLOWED_STATIC_TARGETS.has(segments[0]) &&
    !allowedForRole.has(segments[0]) &&
    SAFE_SEGMENT_REGEX.test(segments[0])
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

export const extractSafeDeepLinkToken = (rawToken: unknown): string | undefined => {
  if (typeof rawToken !== "string") return undefined;
  const trimmed = rawToken.trim();
  if (!SAFE_TOKEN_REGEX.test(trimmed)) return undefined;
  return trimmed;
};
