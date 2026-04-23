import { apiUrl } from "#constants/apiUrl.constants";
import type { CreateGalleryEventPayload } from "#lib/validation/galleryEventValidation";
import { apiRequest } from "#utils/apiRequest";

export type EventTemporalStatus = "Upcoming" | "Active" | "Past";
export type GalleryEventType = "exhibition" | "art_fair" | "viewing_room";

export type EventArtwork = {
  art_id: string;
  title: string;
  artist: string;
  url: string;
  availability: boolean;
  medium?: string;
  year?: string;
  author_id?: string;
  pricing?: { price?: number; shouldShowPrice?: "Yes" | "No"; usd_price?: number };
  impressions?: number;
  like_IDs?: string[];
};

export type GalleryEventRecord = {
  event_id: string;
  gallery_id?: string;
  is_archived?: boolean;
  event_type: GalleryEventType;
  title: string;
  description?: string;
  cover_image: string;
  installation_views?: string[];
  start_date: string;
  end_date: string;
  featured_artworks?: string[];
  artworks?: EventArtwork[];
  location?: {
    venue?: string;
    city?: string;
    country?: string;
  };
  booth_number?: string;
  external_url?: string;
  gallery?: {
    name?: string;
  };
  is_published?: boolean;
  vip_access_token?: string;
  analytics?: EventDashboardAnalytics;
};

export type EventDashboardAnalytics = {
  views?: number;
  views_trend?: string;
  view_in_room?: number;
  view_in_room_trend?: string;
  shares?: number;
  shares_trend?: string;
};

type EventsPagination = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

export const getEventStatus = (
  startDate: string | Date,
  endDate: string | Date,
): EventTemporalStatus => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  if (now < start) return "Upcoming";
  if (now <= end) return "Active";
  return "Past";
};

export async function getAllShows() {
  try {
    const response = await apiRequest(`${apiUrl}/api/events/getAllShows`);
    const result = await response.json();

    return {
      isOk: response.ok,
      data: (result?.shows ?? []) as GalleryEventRecord[],
      message: result?.message as string | undefined,
    };
  } catch (error: any) {
    return {
      isOk: false,
      data: [] as GalleryEventRecord[],
      message:
        error?.message ||
        error?.response?.data?.message ||
        "Failed to fetch shows.",
    };
  }
}

export async function getAllEvents(page = 1, limit = 20, filter = "all") {
  try {
    const response = await apiRequest(
      `${apiUrl}/api/events/getAllEvents?page=${page}&limit=${limit}&filter=${filter}`,
    );
    const result = await response.json();

    return {
      isOk: response.ok,
      data: (result?.data ?? []) as GalleryEventRecord[],
      pagination: (result?.pagination ?? {
        page,
        limit,
        totalItems: 0,
        totalPages: 1,
      }) as EventsPagination,
      message: result?.message as string | undefined,
    };
  } catch (error: any) {
    return {
      isOk: false,
      data: [] as GalleryEventRecord[],
      pagination: {
        page,
        limit,
        totalItems: 0,
        totalPages: 1,
      } as EventsPagination,
      message:
        error?.message ||
        error?.response?.data?.message ||
        "Failed to fetch fairs and events.",
    };
  }
}

export async function getIndividualShow(eventId: string) {
  try {
    const response = await apiRequest(
      `${apiUrl}/api/events/getIndividualShowDetail?eventId=${eventId}`,
    );
    const result = await response.json();

    return {
      isOk: response.ok,
      data: result?.data as GalleryEventRecord | undefined,
      message: result?.message as string | undefined,
    };
  } catch (error: any) {
    return {
      isOk: false,
      data: undefined,
      message:
        error?.message ||
        error?.response?.data?.message ||
        "Failed to fetch show details.",
    };
  }
}

export async function getSingleEvent(eventId: string) {
  try {
    const response = await apiRequest(
      `${apiUrl}/api/events/getSingleEvent?event_id=${eventId}`,
    );
    const result = await response.json();

    return {
      isOk: response.ok,
      data: result?.data as GalleryEventRecord | undefined,
      message: result?.message as string | undefined,
    };
  } catch (error: any) {
    return {
      isOk: false,
      data: undefined,
      message:
        error?.message ||
        error?.response?.data?.message ||
        "Failed to fetch event details.",
    };
  }
}

export async function updateEventDetails(
  eventId: string,
  galleryId: string,
  update_data: Record<string, unknown>,
) {
  try {
    const response = await apiRequest(`${apiUrl}/api/requests/gallery/events/updateEvent`, {
      method: "PATCH",
      body: JSON.stringify({
        event_id: eventId,
        gallery_id: galleryId,
        update_data,
      }),
    });
    const result = await response.json();
    return {
      isOk: response.ok,
      message: result?.message as string | undefined,
    };
  } catch (error: any) {
    return {
      isOk: false,
      message:
        error?.message ||
        error?.response?.data?.message ||
        "Failed to update event details.",
    };
  }
}

export async function toggleEventVisibility(
  eventId: string,
  galleryId: string,
  targetStatus: boolean,
) {
  try {
    const response = await apiRequest(
      `${apiUrl}/api/requests/gallery/events/toggleEventVisibility`,
      {
        method: "PATCH",
        body: JSON.stringify({ eventId, galleryId, targetStatus }),
      },
    );
    const result = await response.json();
    return {
      isOk: response.ok,
      message: result?.message as string | undefined,
    };
  } catch (error: any) {
    return {
      isOk: false,
      message:
        error?.message ||
        error?.response?.data?.message ||
        "Failed to update event visibility.",
    };
  }
}

export async function manageEventVipToken(
  eventId: string,
  galleryId: string,
  action: "generate" | "revoke",
) {
  try {
    const response = await apiRequest(`${apiUrl}/api/requests/gallery/events/manageVipToken`, {
      method: "PATCH",
      body: JSON.stringify({ eventId, galleryId, action }),
    });
    const result = await response.json();
    return {
      isOk: response.ok,
      message: result?.message as string | undefined,
    };
  } catch (error: any) {
    return {
      isOk: false,
      message:
        error?.message ||
        error?.response?.data?.message ||
        "Failed to update VIP access.",
    };
  }
}

export async function updateEventInstallationViews(
  eventId: string,
  galleryId: string,
  image_urls: string | string[],
  type: "add" | "remove",
) {
  try {
    const response = await apiRequest(
      `${apiUrl}/api/requests/gallery/events/updateInstallationViews`,
      {
        method: "PATCH",
        body: JSON.stringify({ event_id: eventId, gallery_id: galleryId, image_urls, type }),
      },
    );
    const result = await response.json();
    return {
      isOk: response.ok,
      message: result?.message as string | undefined,
    };
  } catch (error: any) {
    return {
      isOk: false,
      message:
        error?.message ||
        error?.response?.data?.message ||
        "Failed to update installation views.",
    };
  }
}

export async function updateEventArtworks(
  eventId: string,
  galleryId: string,
  artworkIds: string | string[],
  type: "add" | "remove",
) {
  try {
    const response = await apiRequest(`${apiUrl}/api/requests/gallery/events/update`, {
      method: "PATCH",
      body: JSON.stringify({
        event_id: eventId,
        gallery_id: galleryId,
        artwork_id: artworkIds,
        type,
      }),
    });
    const result = await response.json();
    return {
      isOk: response.ok,
      message: result?.message as string | undefined,
    };
  } catch (error: any) {
    return {
      isOk: false,
      message:
        error?.message ||
        error?.response?.data?.message ||
        "Failed to update event artworks.",
    };
  }
}

export async function archiveGalleryEvent(eventId: string, galleryId: string) {
  try {
    const response = await apiRequest(`${apiUrl}/api/requests/gallery/events/archive`, {
      method: "POST",
      body: JSON.stringify({ event_id: eventId, gallery_id: galleryId }),
    });
    const result = await response.json();
    return {
      isOk: response.ok,
      message: result?.message as string | undefined,
    };
  } catch (error: any) {
    return {
      isOk: false,
      message:
        error?.message ||
        error?.response?.data?.message ||
        "Failed to archive event.",
    };
  }
}

export type GalleryInventoryPagination = {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
};

export async function fetchGalleryProgramming(gallery_id: string) {
  try {
    const response = await apiRequest(
      `${apiUrl}/api/requests/gallery/events/fetch?gallery_id=${encodeURIComponent(gallery_id)}`,
      { method: "GET" },
    );
    const result = await response.json();
    return {
      isOk: response.ok && result?.isOk !== false,
      activeEvents: (result?.activeEvents ?? []) as GalleryEventRecord[],
      pastEvents: (result?.pastEvents ?? []) as GalleryEventRecord[],
      message: result?.message as string | undefined,
    };
  } catch (error: any) {
    return {
      isOk: false,
      activeEvents: [] as GalleryEventRecord[],
      pastEvents: [] as GalleryEventRecord[],
      message:
        error?.message ||
        error?.response?.data?.message ||
        "Failed to load programming.",
    };
  }
}

export async function fetchGalleryInventory(
  galleryId: string,
  page = 1,
  limit = 20,
  searchTerm = "",
) {
  try {
    const response = await apiRequest(
      `${apiUrl}/api/requests/gallery/events/fetchInventory?gallery_id=${encodeURIComponent(galleryId)}&page=${page}&limit=${limit}&search_term=${encodeURIComponent(searchTerm)}`,
      { method: "GET" },
    );
    const result = await response.json();
    const pagination = result?.pagination as GalleryInventoryPagination | undefined;
    return {
      isOk: response.ok,
      message: result?.message as string | undefined,
      data: result?.data,
      pagination: pagination ?? {
        page,
        limit,
        total: 0,
        hasMore: false,
      },
    };
  } catch (error: any) {
    return {
      isOk: false,
      message:
        error?.message ||
        error?.response?.data?.message ||
        "Failed to fetch gallery inventory.",
      data: [],
      pagination: {
        page: 1,
        limit,
        total: 0,
        hasMore: false,
      },
    };
  }
}

export async function createGalleryEvent(payload: CreateGalleryEventPayload) {
  try {
    const response = await apiRequest(`${apiUrl}/api/requests/gallery/events/create`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    return {
      isOk: response.ok,
      message: result?.message as string | undefined,
    };
  } catch (error: any) {
    return {
      isOk: false,
      message:
        error?.message ||
        error?.response?.data?.message ||
        "Failed to create event.",
    };
  }
}

export async function fetchEventDashboardData(eventId: string, galleryId: string) {
  try {
    const response = await apiRequest(
      `${apiUrl}/api/requests/gallery/events/fetchEventDashboardData?event_id=${encodeURIComponent(eventId)}&gallery_id=${encodeURIComponent(galleryId)}`,
      { method: "GET" },
    );
    const result = await response.json();
    return {
      isOk: response.ok,
      message: result?.message as string | undefined,
      data: result?.data,
    };
  } catch (error: any) {
    return {
      isOk: false,
      message:
        error?.message ||
        error?.response?.data?.message ||
        "Failed to fetch event dashboard data.",
      data: undefined,
    };
  }
}
