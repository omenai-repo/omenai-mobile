import { useQuery } from "@tanstack/react-query";
import { getAllShows } from "#services/events/events.service";
import { HOME_QK } from "#utils/queryKeys";
import { useAppStore } from "#store/app/appStore";

export function useFeaturedShows(limit = 10) {
  const { userSession } = useAppStore();

  return useQuery({
    queryKey: HOME_QK.featuredShows(userSession?.id),
    queryFn: async () => {
      const res = await getAllShows();
      if (!res?.isOk || !Array.isArray(res.data)) return [];
      return res.data.slice(0, limit);
    },
  });
}
