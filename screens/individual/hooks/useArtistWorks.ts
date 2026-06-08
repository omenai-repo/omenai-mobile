import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchArtistWorksPage } from "#services/partners/artistPartnerApi";
import { ARTIST_QK } from "#utils/queryKeys";

export function useArtistWorks(
  artistId: string,
  filters: { medium: string; price: string },
) {
  return useInfiniteQuery({
    queryKey: ARTIST_QK.works(artistId, filters),
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetchArtistWorksPage(artistId, pageParam as number, {
        medium: filters.medium,
        price: filters.price,
      });
      if (!res.isOk) throw new Error("Failed to load artworks");
      return res;
    },
    initialPageParam: 1,
    getNextPageParam: (last) => {
      const p = last?.pagination;
      if (p && p.page < p.totalPages) return p.page + 1;
      return undefined;
    },
    enabled: Boolean(artistId),
    staleTime: 5 * 60_000,
    placeholderData: (prev) => prev,
  });
}
