export const QK = {
  highlightGallery: (slice: 'artworks' | 'sales' | 'net' | 'revenue') =>
    ['overview', 'highlight', slice] as const,
  highlightArtist: (slice: 'sales' | 'net' | 'revenue' | 'balance') =>
    ['overview', 'highlight', slice] as const,
  salesOverview: ['overview', 'salesOverview'] as const,
  overviewOrders: ['overview', 'orders', 'recent'] as const,
  popularArtworks: ['overview', 'popularArtworks'] as const,
};

export const HOME_QK = {
  banner: ['home', 'banner'] as const,
  newArtworks: ['home', 'newArtworks'] as const,
  trending: (limit: number) => ['home', 'trending', { limit }] as const,
  curated: (limit: number) => ['home', 'curated', { limit }] as const,
  featuredArtists: ['home', 'featuredArtists'] as const,
  editorials: ['home', 'editorials'] as const,
  recentlyViewed: (userId?: string) => ['home', 'recentlyViewed', { userId }] as const,
};
