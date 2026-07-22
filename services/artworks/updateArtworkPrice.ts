import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";
import { ArtworkPriceFilterData } from "#types/types";

export async function updateArtworkPrice(
  filter: ArtworkPriceFilterData,
  art_id: string,
) {
  try {
    const res = await apiRequest(`${apiUrl}/api/artworks/updateArtworkPrice`, {
      method: "POST",
      body: JSON.stringify({ filter, art_id }),
    });

    const result = await res.json();

    return { isOk: res.ok, message: result.message };
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error updating artwork price",
      },
    };
  }
}
