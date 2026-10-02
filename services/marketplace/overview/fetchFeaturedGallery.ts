import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/network/apiRequest";

export async function getFeaturedGalleries() {
  try {
    const res = await apiRequest(
      `${apiUrl}/api/requests/gallery/fetchFeaturedGalleries`,
      {
        method: "GET",
      },
    );

    const result = await res.json();

    return { isOk: res.ok, message: result.message, data: result.data };
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error fetching featured galleries",
      },
    };
  }
}
