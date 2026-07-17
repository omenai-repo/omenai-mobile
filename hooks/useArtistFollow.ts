import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useUserFollowedIds } from "#hooks/useUserFollowedIds";
import { useAppStore } from "#store/app/appStore";
import { apiRequest } from "#utils/apiRequest";
import { apiUrl } from "#constants/apiUrl.constants";
import { ENGAGEMENTS_QK } from "#utils/queryKeys";

function clearId(map: Record<string, boolean>, id: string) {
  const next = { ...map };
  delete next[id];
  return next;
}

export function useArtistFollow() {
  const queryClient = useQueryClient();
  const { userSession } = useAppStore();
  const { data: followedIds = [], isLoading: isLoadingFollowed } =
    useUserFollowedIds(userSession?.id);
  const [followOverride, setFollowOverride] = useState<Record<string, boolean>>(
    {},
  );

  const isFollowingFor = useCallback(
      (artistId: string) => {
      if (Object.hasOwn(followOverride, artistId)) {
        return followOverride[artistId]!;
      }
      return followedIds.includes(artistId);
    },
    [followOverride, followedIds],
  );

  const toggleFollow = useCallback(
    async (artistId: string) => {
      if (!userSession?.id) return;
      const was = isFollowingFor(artistId);
      setFollowOverride((prev) => ({ ...prev, [artistId]: !was }));

      try {
        const res = await apiRequest(
          `${apiUrl}/api/engagements/${was ? "deleteFollow" : "follow"}`,
          {
            method: was ? "DELETE" : "POST",
            body: JSON.stringify({
              followerId: userSession.id,
              followingId: artistId,
              followingType: "artist",
            }),
          },
        );

        if (!res.ok) {
          setFollowOverride((prev) => clearId(prev, artistId));
          return;
        }

        await queryClient.refetchQueries({
          queryKey: ENGAGEMENTS_QK.userFollowedIds(userSession.id),
        });
        setFollowOverride((prev) => clearId(prev, artistId));
      } catch {
        setFollowOverride((prev) => clearId(prev, artistId));
      }
    },
    [isFollowingFor, queryClient, userSession?.id],
  );

  return {
    isFollowingFor,
    toggleFollow,
    isLoadingFollowed,
    hasUser: Boolean(userSession?.id),
  };
}
