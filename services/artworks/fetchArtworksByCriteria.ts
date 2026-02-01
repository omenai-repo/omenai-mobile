import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function fetchArtworksByCriteria({
  medium,
  filters,
  page,
}: {
  medium: string;
  filters: any;
  page: number;
}) {
  try {
    const response = await apiRequest(
      `${apiUrl}/api/artworks/getArtworksByCriteria`,
      {
        method: "POST",
        body: JSON.stringify({ page, medium, filters }),
      },
    );

    const result = await response.json();

    return { isOk: response.ok, data: result.data };
  } catch (error) {
    return {
      isOk: false,
      body: { message: "Error fetching similar posts" },
    };
  }
}
