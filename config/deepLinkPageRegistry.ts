import { screenName } from "#constants/screenNames.constants";

type PageDefinition = {
  kind: "tab" | "stack" | "auth";
  roles: DeepLinkAppRole[];
  screenName: string;
  roleWrapper: DeepLinkNavigationTarget["roleWrapper"];
  requiredParams?: string[];
  /** Tab to open when verify `params` are missing required keys. */
  missingParamsFallback?: DeepLinkTabPage;
};

const ROLE_WRAPPER: Record<DeepLinkAppRole, PageDefinition["roleWrapper"]> = {
  individual: "Individual",
  artist: "Artist",
  gallery: "Gallery",
};

const PAGE_REGISTRY: Record<DeepLinkPage, PageDefinition> = {
  overview: {
    kind: "tab",
    roles: ["individual", "artist", "gallery"],
    screenName: screenName.home,
    roleWrapper: "Individual",
  },
  artworks: {
    kind: "tab",
    roles: ["individual", "artist", "gallery"],
    screenName: screenName.catalogListing,
    roleWrapper: "Individual",
  },
  orders: {
    kind: "tab",
    roles: ["individual", "artist", "gallery"],
    screenName: screenName.orders,
    roleWrapper: "Individual",
  },
  profile: {
    kind: "tab",
    roles: ["individual", "artist", "gallery"],
    screenName: screenName.profile,
    roleWrapper: "Individual",
  },
  review: {
    kind: "tab",
    roles: ["artist"],
    screenName: screenName.artist.reviewHub,
    roleWrapper: "Artist",
  },
  billing: {
    kind: "tab",
    roles: ["gallery"],
    screenName: screenName.gallery.subscriptions,
    roleWrapper: "Gallery",
  },
  payouts: {
    kind: "tab",
    roles: ["gallery"],
    screenName: screenName.gallery.stripePayouts,
    roleWrapper: "Gallery",
  },
  wallet: {
    kind: "tab",
    roles: ["artist"],
    screenName: screenName.artist.wallet,
    roleWrapper: "Artist",
  },
  artwork: {
    kind: "stack",
    roles: ["individual", "artist", "gallery"],
    screenName: screenName.artwork,
    roleWrapper: "Individual",
    requiredParams: ["art_id"],
    missingParamsFallback: "artworks",
  },
  purchase: {
    kind: "stack",
    roles: ["individual"],
    screenName: screenName.purchaseArtwork,
    roleWrapper: "Individual",
    requiredParams: ["art_id"],
    missingParamsFallback: "artworks",
  },
  payment: {
    kind: "stack",
    roles: ["individual"],
    screenName: screenName.payment,
    roleWrapper: "Individual",
    requiredParams: ["order_id", "user_id"],
    missingParamsFallback: "overview",
  },
  login: {
    kind: "auth",
    roles: ["individual", "artist", "gallery"],
    screenName: screenName.login,
    roleWrapper: "Individual",
  },
};

const TAB_SCREEN_BY_ROLE: Record<
  DeepLinkTabPage,
  Partial<Record<DeepLinkAppRole, string>>
> = {
  overview: {
    individual: screenName.home,
    artist: "Overview",
    gallery: screenName.gallery.overview,
  },
  artworks: {
    individual: screenName.catalogListing,
    artist: "Artworks",
    gallery: screenName.gallery.artworks,
  },
  orders: {
    individual: screenName.orders,
    artist: "Orders",
    gallery: screenName.gallery.orders,
  },
  profile: {
    individual: screenName.profile,
    artist: "Profile",
    gallery: screenName.gallery.profile,
  },
  review: { artist: screenName.artist.reviewHub },
  billing: { gallery: screenName.gallery.subscriptions },
  payouts: { gallery: screenName.gallery.stripePayouts },
  wallet: { artist: screenName.artist.wallet },
};

export const toAppRole = (
  role: DeepLinkWebRole | DeepLinkAppRole,
): DeepLinkAppRole => (role === "user" ? "individual" : role);

const resolveTabScreenName = (
  page: DeepLinkTabPage,
  appRole: DeepLinkAppRole,
) => TAB_SCREEN_BY_ROLE[page][appRole] ?? PAGE_REGISTRY[page].screenName;

const mapApiParamsToNavParams = (
  page: DeepLinkPage,
  params: Record<string, string>,
): Record<string, unknown> => {
  const mapped: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(params)) {
    if (page === "payment" && key === "order_id") {
      mapped.id = value;
      continue;
    }
    if (key === "order_id") mapped.orderId = value;
    else if (key === "event_id") mapped.eventId = value;
    else if (key === "gallery_id") mapped.galleryId = value;
    else if (key === "route_name") mapped.routeName = value;
    else if (key === "plan_id") mapped.planId = value;
    else if (key === "plan_interval") mapped.planInterval = value;
    else if (key === "payment_intent") mapped.payment_intent = value;
    else if (key === "setup_intent") mapped.setup_intent = value;
    else if (key === "invoice_number") mapped.invoiceNumber = value;
    else mapped[key] = value;
  }
  return mapped;
};

const hasRequiredParams = (
  page: DeepLinkPage,
  params: Record<string, string>,
): boolean => {
  const def = PAGE_REGISTRY[page];
  if (def.kind === "auth") return true;
  const required = def.requiredParams;
  if (!required?.length) return true;
  return required.every((key) => Boolean(params[key]?.trim()));
};

const tabTargetForPage = (
  page: DeepLinkTabPage,
  appRole: DeepLinkAppRole,
): DeepLinkNavigationTarget => ({
  type: "navigate",
  roleWrapper: ROLE_WRAPPER[appRole],
  screen: resolveTabScreenName(page, appRole),
  kind: "tab",
});

export const resolveLoginDeepLink = (
  data: DeepLinkPayload,
  options: DeepLinkSessionOptions,
): DeepLinkResolveResult => {
  const accountType = toAppRole(data.role);

  if (options.isLoggedIn) {
    return {
      type: "fallback",
      reason: "overview",
      appRole: sessionAppRole(options),
    };
  }

  return { type: "fallback", reason: "login", accountType };
};

export const resolveDeepLinkTarget = (
  data: DeepLinkPayload,
  options: DeepLinkSessionOptions,
): DeepLinkResolveResult => {
  const page = data.payload.page.trim().toLowerCase() as DeepLinkPage;
  const def = PAGE_REGISTRY[page];

  if (!def) {
    return {
      type: "fallback",
      reason: "overview",
      appRole: sessionAppRole(options),
    };
  }

  if (def.kind === "auth") {
    return resolveLoginDeepLink(data, options);
  }

  if (!options.isLoggedIn) {
    return {
      type: "fallback",
      reason: "login",
      accountType: toAppRole(data.role),
    };
  }

  const appRole = toAppRole(data.role);

  if (!def.roles.includes(appRole)) {
    return { type: "fallback", reason: "overview", appRole };
  }

  const params = data.params ?? {};
  if (!hasRequiredParams(page, params)) {
    const fallbackPage = def.missingParamsFallback ?? "overview";
    return tabTargetForPage(fallbackPage, appRole);
  }

  const roleWrapper = ROLE_WRAPPER[appRole];

  if (def.kind === "tab") {
    return {
      type: "navigate",
      roleWrapper,
      screen: resolveTabScreenName(page as DeepLinkTabPage, appRole),
      kind: "tab",
    };
  }

  return {
    type: "navigate",
    roleWrapper,
    screen: def.screenName,
    params: mapApiParamsToNavParams(page, params),
    kind: "stack",
  };
};

export const fallbackOverviewTarget = (
  appRole: DeepLinkAppRole,
): DeepLinkNavigationTarget => ({
  type: "navigate",
  roleWrapper: ROLE_WRAPPER[appRole],
  screen: resolveTabScreenName("overview", appRole),
  kind: "tab",
});

export const sessionAppRole = (
  options: DeepLinkSessionOptions,
): DeepLinkAppRole => {
  if (options.userType === "user") return "individual";
  if (options.userType === "artist" || options.userType === "gallery") {
    return options.userType;
  }
  return "individual";
};
