import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/network/apiRequest";

export async function getFeaturedGalleryData({
  gallery_id,
  page = 1,
}: {
  gallery_id: string;
  page?: number;
}) {
  try {
    const res = await apiRequest(
      `${apiUrl}/api/requests/gallery/fetchFeaturedGalleryData?id=${gallery_id}&page=${page}`,
      {
        method: "GET",
      },
    );

    const result = await res.json();

    return { isOk: res.ok, message: result.message, data: result };
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error fetching featured gallery data",
      },
    };
  }
}
