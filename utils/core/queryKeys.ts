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

  featuredFeed: (userId?: string) => ["home", "featuredFeed", userId],

  curatorPicks: (userId?: string) => ["home", "curatorPicks", userId],

  featuredShows: (userId?: string) => ["home", "featuredShows", userId],

  featuredGalleries: (userId?: string) => ["home", "featuredGalleries", userId],

  fairsEventsPreview: (userId?: string) => [
    "home",
    "fairsEventsPreview",
    userId,
  ],

  editorials: (userId?: string) => ["home", "editorials", userId],

  recentlyViewed: (userId?: string) => ["home", "recentlyViewed", userId],
};

export const ENGAGEMENTS_QK = {
  userFollowedIds: (sessionId?: string) =>
    ["user-followed-ids", sessionId] as const,
};

export const ARTIST_QK = {
  directory: (userId?: string) => ["artist", "directory", userId] as const,
  works: (
    artistId: string,
    filters: { medium?: string; price?: string } = {},
  ) =>
    [
      "artist",
      "works",
      artistId,
      filters.medium ?? "All",
      filters.price ?? "All",
    ] as const,
};

export const ORDERS_QK = ["orders", "artist"] as const;

export const SEARCH_QK = {
  query: (query: string) => ["search", "results", query],
};

export const SUBSCRIPTION_QK = {
  precheck: (userId?: string) => ["subscription_precheck", userId] as const,
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
  allFairsEvents: (filter: string) =>
    ["events", "fairs-events", filter] as const,
  fairsEventsInfinite: ["events", "fairs-events", "infinite", "all"] as const,
  fairsEventsPaged: (filter: string, page: number, limit: number) =>
    ["events", "fairs-events", filter, page, limit] as const,
  showsList: ["events", "shows", "list"] as const,
  galleriesList: (page: number, limit: number) =>
    ["events", "galleries", page, limit] as const,
  galleriesDirectory: (pageSize: number) =>
    ["events", "galleries", "directory", pageSize] as const,
  galleryProgramming: (galleryId: string) =>
    ["events", "gallery-programming", galleryId] as const,
  details: (eventId: string, source: "show" | "event") =>
    ["events", "details", source, eventId] as const,
  galleryOverview: (galleryId: string) =>
    ["events", "gallery", "overview", galleryId] as const,
  galleryProfile: (galleryId: string) =>
    ["events", "gallery", "profile", galleryId] as const,
  /** Matches web `GalleryWorksWrapper` query — include filters so cache splits per filter set. */
  galleryWorks: (
    galleryId: string,
    filters: { artist?: string; medium?: string; price?: string } = {},
  ) =>
    [
      "events",
      "gallery",
      "works",
      galleryId,
      filters.artist ?? "All",
      filters.medium ?? "All",
      filters.price ?? "All",
    ] as const,
  galleryShowsTab: (galleryId: string) =>
    ["events", "gallery", "shows", galleryId] as const,
  galleryContact: (galleryId: string) =>
    ["events", "gallery", "contact", galleryId] as const,
};
