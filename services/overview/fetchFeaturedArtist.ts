import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function getFeaturedArtists() {
  try {
    const res = await apiRequest(
      `${apiUrl}/api/requests/artist/fetchTrendingArtists`,
      {
        method: "GET",
      },
    );

    const result = await res.json();

    return { isOk: res.ok, message: result.message, data: result.data };
  } catch (error: any) {
    console.log(error);
  }
}
