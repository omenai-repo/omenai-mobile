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


export function useGalleryFollow() {
  const queryClient = useQueryClient();
  const { userSession } = useAppStore();
  const { data: followedIds = [], isLoading: isLoadingFollowed } = useUserFollowedIds(
    userSession?.id,
  );
  const [followOverride, setFollowOverride] = useState<Record<string, boolean>>({});

  const isFollowingFor = useCallback(
    (galleryId: string) => {
      if (Object.prototype.hasOwnProperty.call(followOverride, galleryId)) {
        return followOverride[galleryId]!;
      }
      return followedIds.includes(galleryId);
    },
    [followOverride, followedIds],
  );

  const toggleFollow = useCallback(
    async (galleryId: string) => {
      if (!userSession?.id) return;
      const was = isFollowingFor(galleryId);
      setFollowOverride((prev) => ({ ...prev, [galleryId]: !was }));
      try {
        const res = await apiRequest(
          `${apiUrl}/api/engagements/${was ? "deleteFollow" : "follow"}`,
          {
            method: was ? "DELETE" : "POST",
            body: JSON.stringify({
              followerId: userSession.id,
              followingId: galleryId,
              followingType: "gallery",
            }),
          },
        );
        if (!res.ok) {
          setFollowOverride((prev) => clearId(prev, galleryId));
          return;
        }
        await queryClient.refetchQueries({
          queryKey: ENGAGEMENTS_QK.userFollowedIds(userSession.id),
        });
        setFollowOverride((prev) => clearId(prev, galleryId));
      } catch {
        setFollowOverride((prev) => clearId(prev, galleryId));
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
