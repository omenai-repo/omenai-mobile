import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getAllEvents,
  getSingleEvent,
  type GalleryEventRecord,
} from "#services/events/events.service";
import { EVENTS_QK, HOME_QK } from "#utils/queryKeys";
import { useAppStore } from "#store/app/appStore";

/** Web `AllFairEventsClient` — paginated `getAllEvents(..., "all")` for the fairs list. */
export function useFairsEventsInfinite(pageSize = 20) {
  return useInfiniteQuery({
    queryKey: EVENTS_QK.fairsEventsInfinite,
    queryFn: async ({ pageParam = 1 }) => {
      const res = await getAllEvents(pageParam, pageSize, "All");
      return {
        data: res.isOk ? res.data : [],
        pagination: res.pagination,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (last) => {
      const p = last.pagination;
      if (p && p.page < p.totalPages) return p.page + 1;
      return undefined;
    },
  });
}

export function useFairsEvents(filter = "All", page = 1, limit = 20) {
  return useQuery({
    queryKey: EVENTS_QK.fairsEventsPaged(filter, page, limit),
    queryFn: async () => {
      const res = await getAllEvents(page, limit, filter);
      return {
        data: res?.isOk ? res.data : [],
        pagination: res?.pagination,
      };
    },
  });
}

export function useFairsEventsPreview(limit = 10) {
  const { userSession } = useAppStore();
  return useQuery({
    queryKey: HOME_QK.fairsEventsPreview(userSession?.id),
    queryFn: async () => {
      const res = await getAllEvents(1, limit, "All");
      return res?.isOk ? res.data : [];
    },
  });
}

export function useFairEventDetails(eventId?: string) {
  return useQuery<GalleryEventRecord | undefined>({
    queryKey: eventId ? EVENTS_QK.details(eventId, "event") : ["events", "details", "event", "none"],
    queryFn: async () => {
      if (!eventId) return undefined;
      const res = await getSingleEvent(eventId);
      return res?.isOk ? res.data : undefined;
    },
    enabled: Boolean(eventId),
  });
}
