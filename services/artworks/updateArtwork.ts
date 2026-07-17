import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function updateArtwork(
  filter: Record<string, any>,
  art_id: string,
) {
  try {
    const res = await apiRequest(`${apiUrl}/api/artworks/updateArtwork`, {
      method: "POST",
      body: JSON.stringify({ filter, art_id }),
    });

    const result = await res.json();

    return { isOk: res.ok, message: result.message };
  } catch (error: any) {
    return {
      isOk: false,
      message:
        error.message ||
        error?.response?.data?.message ||
        "Error updating artwork",
    };
  }
}
