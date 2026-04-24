import { useQuery } from "@tanstack/react-query";
import { fetchFollows } from "#services/engagements/fetchFollows";
import { ENGAGEMENTS_QK } from "#utils/queryKeys";

export function useUserFollowedIds(sessionId: string | undefined) {
  return useQuery({
    queryKey: ENGAGEMENTS_QK.userFollowedIds(sessionId),
    queryFn: async () => {
      if (!sessionId) return [] as string[];
      const res = await fetchFollows(sessionId);
      if (!res.isOk) return [] as string[];
      return res.followedIds ?? [];
    },
    enabled: Boolean(sessionId),
    staleTime: Infinity,
  });
}
