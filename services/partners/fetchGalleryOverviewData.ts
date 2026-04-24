import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/apiRequest";

export type GalleryOverviewEvent = {
  event_id: string;
  title: string;
  cover_image: string;
  start_date: string;
  end_date: string;
  event_type: string;
  location?: { city?: string; country?: string };
};

export type GalleryOverviewArtist = {
  artist_id: string;
  name: string;
  totalWorks?: number;
  total_works?: number;
  availableWorks?: number;
  available_works?: number;
};

export type GalleryOverviewData = {
  name?: string;
  description?: string;
  events?: GalleryOverviewEvent[];
  represented_artists?: GalleryOverviewArtist[];
  available_artists?: GalleryOverviewArtist[];
};

export async function fetchGalleryOverviewData(galleryId: string) {
  try {
    const res = await apiRequest(
      `${apiUrl}/api/partners/getGalleryOverviewData?id=${encodeURIComponent(galleryId)}`,
      { method: "GET" },
    );
    const result = (await res.json()) as { data?: GalleryOverviewData; message?: string };
    return {
      isOk: res.ok,
      data: (result.data ?? undefined) as GalleryOverviewData | undefined,
      message: result.message,
    };
  } catch (e: any) {
    return {
      isOk: false,
      message: e?.message ?? "Error loading gallery overview",
    };
  }
}
