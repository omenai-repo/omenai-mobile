import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/network/apiRequest";

export type GalleryListRecord = {
  gallery_id: string;
  name: string;
  logo: string;
  bio?: string;
  followerCount?: number;
  address?: { city?: string; country?: string };
};

export type GalleryListResponse = {
  data: GalleryListRecord[];
  pagination?: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
};

export async function fetchGalleries(page = 1, limit = 15) {
  try {
    const res = await apiRequest(
      `${apiUrl}/api/requests/gallery/fetchGalleries?page=${page}&limit=${limit}`,
      {
        method: "GET",
      },
    );

    const result = (await res.json()) as GalleryListResponse;

    return {
      isOk: res.ok,
      data: Array.isArray(result?.data) ? result.data : [],
      pagination: result?.pagination,
      message: (result as any)?.message as string | undefined,
    };
  } catch (error: any) {
    return {
      isOk: false,
      data: [] as GalleryListRecord[],
      pagination: undefined,
      message:
        error?.message ||
        error?.response?.data?.message ||
        "Error fetching galleries",
    };
  }
}
