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
  }: {
    state: boolean;
    sessionId: string;
  }) => {
    const data = await updateArtworkImpressions(art_id, state, sessionId);
    if (data?.isOk) {
      // Invalidate the artwork query so the liked state is fresh on next open
      queryClient.invalidateQueries({ queryKey: ["artwork", art_id] });
      queryClient.invalidateQueries({ queryKey: ["saved-artworks"] });
    } else {
      // Rollback optimistic update on failure
      setLikedState({ count: initialImpressions, ids: initialLikeIds });
    }
  };

  // handle onClick like button
  const handleLike = async (state: any) => {
    if (sessionId === undefined || sessionId === "") {
      openGuestLoginModal();
    } else {
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
      }

      // Persist the change to the server
      await updateLikesMutation({ state, sessionId });
    }
  };

  // Return stateful copy of like data
  return { likedState, handleLike };
}

export default useLikedState;
