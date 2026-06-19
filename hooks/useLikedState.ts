import { updateArtworkImpressions } from "#services/artworks/updateArtworkImpressions";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useGuestLoginModalStore } from "#store/guest/guestLoginModalStore";

function useLikedState(
  initialImpressions: number,
  initialLikeIds: string[],
  sessionId: string | undefined,
  art_id: string,
) {
  const { openGuestLoginModal } = useGuestLoginModalStore();
  const queryClient = useQueryClient();

  // Initialize stateful data copy of likes data
  const [likedState, setLikedState] = useState({
    count: initialImpressions,
    ids: initialLikeIds,
  });

  useEffect(() => {
    setLikedState({ count: initialImpressions, ids: initialLikeIds });
  }, [initialImpressions, initialLikeIds]);

  const updateLikesMutation = async ({
    state,
    sessionId,
    previousSavedCache,
  }: {
    state: boolean;
    sessionId: string;
    previousSavedCache: unknown;
  }) => {
    const data = await updateArtworkImpressions(art_id, state, sessionId);
    if (data?.isOk) {
      // Invalidate queries so they re-fetch fresh data in the background
      queryClient.invalidateQueries({ queryKey: ["artwork", art_id] });
      queryClient.invalidateQueries({ queryKey: ["saved-artworks"] });
      queryClient.invalidateQueries({ queryKey: ["home"] });
      queryClient.invalidateQueries({ queryKey: ["artworks"] });
    } else {
      setLikedState({ count: initialImpressions, ids: initialLikeIds });
      if (previousSavedCache !== undefined) {
        queryClient.setQueryData(["saved-artworks"], previousSavedCache);
      }
    }
  };

  // handle onClick like button
  const handleLike = async (state: any) => {
    if (sessionId === undefined || sessionId === "") {
      openGuestLoginModal();
    } else {
      let previousSavedCache: unknown = undefined;

      if (state) {
        setLikedState((prev) => ({
          // Prevent duplicate count increment (fix stale closure bug)
          count: prev.ids.includes(sessionId) ? prev.count : prev.count + 1,
          // Prevent duplicate IDs using prev.ids instead of likedState.ids
          ids: prev.ids.includes(sessionId)
            ? prev.ids
            : [...prev.ids, sessionId],
        }));
      } else {
        setLikedState((prev) => ({
          // Only decrement if the ID actually existed
          count: !prev.ids.includes(sessionId) ? prev.count : prev.count - 1,
          ids: prev.ids.filter((id) => id !== sessionId),
        }));

        // Optimistically remove the artwork from the saved-artworks cache
        // so the card disappears immediately without waiting for a re-fetch.
        previousSavedCache = queryClient.getQueryData(["saved-artworks"]);
        queryClient.setQueryData(["saved-artworks"], (old: any) => {
          if (!old?.pages) return old;
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              data: (page.data ?? []).filter(
                (item: any) => item.art_id !== art_id,
              ),
              total: Math.max(0, (page.total ?? 1) - 1),
            })),
          };
        });
      }

      // Persist the change to the server
      await updateLikesMutation({ state, sessionId, previousSavedCache });
    }
  };

  // Return stateful copy of like data
  return { likedState, handleLike };
}

export default useLikedState;
