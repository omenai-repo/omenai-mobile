import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getFeaturedGalleryData } from "#services/overview/fetchFeaturedGalleryData";
import { fetchGalleries, type GalleryListRecord } from "#services/overview/fetchGalleries";
import { fetchGalleryOverviewData, type GalleryOverviewData } from "#services/partners/fetchGalleryOverviewData";
import { fetchGalleryContact, fetchGalleryProfile } from "#services/partners/galleryPartnerApi";
import type { GalleryContactData, GalleryProfile } from "#services/partners/galleryPartnerApi";
import { HOME_QK, EVENTS_QK } from "#utils/queryKeys";
import { useAppStore } from "#store/app/appStore";

export function useGalleries(page = 1, limit = 15) {
  return useQuery({
    queryKey: EVENTS_QK.galleriesList(page, limit),
    queryFn: async () => {
      const res = await fetchGalleries(page, limit);
      return {
        data: res?.isOk ? res.data : [],
        pagination: res?.pagination,
      };
    },
  });
}

export function useGalleriesDirectoryPageSize(pageSize = 15) {
  return useInfiniteQuery({
    queryKey: EVENTS_QK.galleriesDirectory(pageSize),
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const res = await fetchGalleries(pageParam, pageSize);
      return {
        data: res?.isOk ? res.data : ([] as GalleryListRecord[]),
        pagination: res?.pagination,
      };
    },
    getNextPageParam: (lastPage) => {
      const p = lastPage?.pagination;
      if (p == null) return undefined;
      const { page, totalPages } = p;
      if (typeof page === "number" && typeof totalPages === "number" && page < totalPages) {
        return page + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60_000,
  });
}

export function useFeaturedGalleries(limit = 10) {
  const { userSession } = useAppStore();
  return useQuery<GalleryListRecord[]>({
    queryKey: HOME_QK.featuredGalleries(userSession?.id),
    queryFn: async () => {
      const res = await fetchGalleries(1, limit);
      return res?.isOk ? res.data : [];
    },
    staleTime: 5 * 60_000,
    gcTime: 15 * 60_000,
  });
}

export function useGalleryDetails(galleryId?: string) {
  return useQuery({
    queryKey: galleryId ? ["gallery", "details", galleryId] : ["gallery", "details", "none"],
    queryFn: async () => {
      if (!galleryId) return undefined;
      const res = await getFeaturedGalleryData({ gallery_id: galleryId });
      return res?.isOk ? res.data : undefined;
    },
    enabled: Boolean(galleryId),
  });
}

export function useGalleryOverview(galleryId?: string) {
  return useQuery<GalleryOverviewData | undefined>({
    queryKey: galleryId ? EVENTS_QK.galleryOverview(galleryId) : ["events", "gallery", "overview", "none"],
    queryFn: async () => {
      if (!galleryId) return undefined;
      const res = await fetchGalleryOverviewData(galleryId);
      if (!res.isOk) return undefined;
      return res.data ?? {};
    },
    enabled: Boolean(galleryId),
    staleTime: 10 * 60_000,
  });
}

export function useGalleryProfile(galleryId?: string) {
  return useQuery<GalleryProfile | undefined>({
    queryKey: galleryId ? EVENTS_QK.galleryProfile(galleryId) : ["events", "gallery", "profile", "none"],
    queryFn: async () => {
      if (!galleryId) return undefined;
      const res = await fetchGalleryProfile(galleryId);
      return res.isOk ? res.data : undefined;
    },
    enabled: Boolean(galleryId),
    staleTime: 10 * 60_000,
  });
}

export function useGalleryContact(galleryId?: string, enabled = true) {
  return useQuery<GalleryContactData | undefined>({
    queryKey: galleryId ? EVENTS_QK.galleryContact(galleryId) : ["events", "gallery", "contact", "none"],
    queryFn: async () => {
      if (!galleryId) return undefined;
      const res = await fetchGalleryContact(galleryId);
      return res.isOk ? res.data : undefined;
    },
    enabled: Boolean(galleryId) && enabled,
    staleTime: 30 * 60_000,
  });
}
