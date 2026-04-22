export const QK = {
  highlightGallery: (
    slice: "artworks" | "sales" | "net" | "revenue",
    userId?: string,
  ) => ["overview", "highlight", "gallery", slice, userId],

  highlightArtist: (
    slice: "sales" | "net" | "revenue" | "balance",
    userId?: string,
  ) => ["overview", "highlight", "artist", slice, userId],

  salesOverview: (userId?: string, year?: string) => [
    "overview",
    "salesOverview",
    userId,
    year,
  ],

  overviewOrders: (userId?: string) => ["overview", "orders", "recent", userId],

  popularArtworks: (userId?: string) => ["overview", "popularArtworks", userId],
};

export const HOME_QK = {
  banner: (userId?: string) => ["home", "banner", userId],

  newArtworks: (userId?: string) => ["home", "newArtworks", userId],

  trending: (limit: number, userId?: string) => [
    "home",
    "trending",
    limit,
    userId,
  ],

  curated: (limit: number, userId?: string) => [
    "home",
    "curated",
    limit,
    userId,
  ],

  featuredArtists: (userId?: string) => ["home", "featuredArtists", userId],

  editorials: (userId?: string) => ["home", "editorials", userId],

  recentlyViewed: (userId?: string) => ["home", "recentlyViewed", userId],
};

export const ORDERS_QK = ["orders", "artist"] as const;

export const SEARCH_QK = {
  query: (query: string) => ["search", "results", query],
};

export const WALLET_QK = {
  artist: ["wallet", "artist"] as const,
  validate: (bankCode: string, acctNumber: string) => [
    "wallet",
    "validate",
    bankCode,
    acctNumber,
  ],
};

export const EVENTS_QK = {
  allShows: ["events", "shows"] as const,
  allFairsEvents: (filter: string) => ["events", "fairs-events", filter] as const,
  details: (eventId: string, source: "show" | "event") =>
    ["events", "details", source, eventId] as const,
};
