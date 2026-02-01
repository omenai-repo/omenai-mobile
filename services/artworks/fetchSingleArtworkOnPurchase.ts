import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function fetchsingleArtworkOnPurchase(art_id: string) {
  try {
    const response = await apiRequest(
      `${apiUrl}/api/artworks/getSingleArtworkOnPurchase`,
      {
        method: "POST",
        body: JSON.stringify({ art_id }),
      },
    );

    const result = await response.json();

    return { isOk: response.ok, message: result.message, data: result.data };
  } catch {
    return {
      isOk: false,
      body: { message: "Error fetching artwork details" },
    };
  }
}
