import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function getFeaturedArtistData({
  artist_id,
  page = 1,
}: {
  artist_id: string;
  page?: number;
}) {
  try {
    const res = await apiRequest(
      `${apiUrl}/api/requests/artist/fetchFeaturedArtistData?id=${artist_id}&page=${page}`,
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
          "Error fetching featured artist data",
      },
    };
  }
}
