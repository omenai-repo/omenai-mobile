import { useQuery } from "@tanstack/react-query";
import { getArtists } from "#services/overview/fetchArtist";
import { ARTIST_QK } from "#utils/queryKeys";
import { useAppStore } from "#store/app/appStore";

export function useAllArtists() {
  const { userSession } = useAppStore();

  return useQuery({
    queryKey: ARTIST_QK.directory(userSession?.id),
    queryFn: async () => {
      const res = await getArtists();
      if (!res?.isOk) {
        throw new Error(
          res?.message || res?.body?.message || "Failed to load artists.",
        );
      }
      return res.data?.all_artists ?? [];
    },
    staleTime: 5 * 60_000,
    gcTime: 15 * 60_000,
  });
}
