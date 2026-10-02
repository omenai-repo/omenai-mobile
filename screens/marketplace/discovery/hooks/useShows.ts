import { useQuery } from "@tanstack/react-query";
import {
  getAllShows,
  getIndividualShow,
  type GalleryEventRecord,
} from "#services/marketplace/events/events.service";
import { EVENTS_QK } from "#utils/core/queryKeys";

export function useShows() {
  return useQuery({
    queryKey: EVENTS_QK.showsList,
    queryFn: async () => {
      const res = await getAllShows();
      return res?.isOk ? res.data : [];
    },
    staleTime: 5 * 60_000,
    gcTime: 15 * 60_000,
  });
}

export function useShowDetails(eventId?: string) {
  return useQuery<GalleryEventRecord | undefined>({
    queryKey: eventId ? EVENTS_QK.details(eventId, "show") : ["events", "details", "show", "none"],
    queryFn: async () => {
      if (!eventId) return undefined;
      const res = await getIndividualShow(eventId);
      return res?.isOk ? res.data : undefined;
    },
    enabled: Boolean(eventId),
  });
}
