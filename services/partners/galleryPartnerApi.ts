import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/apiRequest";

export type GalleryProfile = {
  gallery_id: string;
  name: string;
  logo?: string;
  followerCount?: number;
  address?: { city?: string; country?: string; state?: string; zip?: string; address_line?: string };
};

export type GalleryContactData = {
  name: string;
  address?: {
    address_line?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
};

export async function fetchGalleryProfile(galleryId: string) {
  try {
    const res = await apiRequest(
      `${apiUrl}/api/partners/getGalleryProfile?id=${encodeURIComponent(galleryId)}`,
      { method: "GET" },
    );
    const result = (await res.json()) as { data?: GalleryProfile };
    return { isOk: res.ok, data: result.data };
  } catch {
    return { isOk: false, data: undefined as GalleryProfile | undefined };
  }
}

export async function fetchGalleryWorksPage(
  galleryId: string,
  page: number,
  opts?: { artist?: string; medium?: string; price?: string },
) {
  const q = new URLSearchParams({
    page: String(page),
    id: galleryId,
    limit: "20",
  });
  if (opts?.artist && opts.artist !== "All") q.set("artist", opts.artist);
  if (opts?.medium && opts.medium !== "All") q.set("medium", opts.medium);
  if (opts?.price && opts.price !== "All") q.set("price", opts.price);
  try {
    const res = await apiRequest(`${apiUrl}/api/events/getGalleryWorks?${q.toString()}`, {
      method: "GET",
    });
    const result = (await res.json()) as {
      data?: unknown[];
      pagination?: { page: number; totalPages: number };
    };
    return {
      isOk: res.ok,
      data: Array.isArray(result.data) ? result.data : [],
      pagination: result.pagination,
    };
  } catch {
    return { isOk: false, data: [] as unknown[], pagination: undefined };
  }
}

export async function fetchGalleryShowsPage(galleryId: string, page: number, limit = 12) {
  try {
    const res = await apiRequest(
      `${apiUrl}/api/partners/getGalleryShows?id=${encodeURIComponent(galleryId)}&page=${page}&limit=${limit}`,
      { method: "GET" },
    );
    const result = (await res.json()) as {
      data?: unknown[];
      pagination?: { page: number; totalPages: number };
    };
    return {
      isOk: res.ok,
      data: Array.isArray(result.data) ? result.data : [],
      pagination: result.pagination,
    };
  } catch {
    return { isOk: false, data: [] as unknown[], pagination: undefined };
  }
}

export type GalleryArtistFloorRow = {
  artist_id: string;
  name: string;
  country?: string;
  birthyear?: string;
  isRepresented?: boolean;
  totalWorks?: number;
  artworks?: unknown[];
};

export async function fetchGalleryArtistsPage(
  galleryId: string,
  page: number,
  limit = 10,
  artistId?: string,
) {
  const q = new URLSearchParams({
    id: galleryId,
    page: String(page),
    limit: String(limit),
    artist: artistId ?? "",
  });
  try {
    const res = await apiRequest(`${apiUrl}/api/partners/getGalleryArtists?${q.toString()}`, {
      method: "GET",
    });
    const result = (await res.json()) as {
      data?: GalleryArtistFloorRow[];
      pagination?: { page: number; totalPages: number; total?: number; limit?: number };
    };
    return {
      isOk: res.ok,
      data: Array.isArray(result.data) ? result.data : [],
      pagination: result.pagination,
    };
  } catch {
    return { isOk: false, data: [] as GalleryArtistFloorRow[], pagination: undefined };
  }
}

export async function fetchGalleryContact(galleryId: string) {
  try {
    const res = await apiRequest(
      `${apiUrl}/api/partners/getGalleryContact?id=${encodeURIComponent(galleryId)}`,
      { method: "GET" },
    );
    const result = (await res.json()) as { data?: GalleryContactData };
    return { isOk: res.ok, data: result.data };
  } catch {
    return { isOk: false, data: undefined as GalleryContactData | undefined };
  }
}
