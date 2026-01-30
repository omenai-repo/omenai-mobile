import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function fetchTrendingArtworks({
  page,
  filters,
}: {
  page: number;
  filters: any;
}) {
  try {
    const response = await apiRequest(
      `${apiUrl}/api/artworks/getTrendingArtworks`,
      {
        method: "POST",
        body: JSON.stringify({ page, filters }),
      },
    ).then(async (res) => {
      if (!res.ok) return undefined;
      const result = await res.json();

      return result;
    });

    return response;
  } catch (error) {
    return {
      isOk: false,
      body: { message: "Error fetching similar posts" },
    };
  }
}
