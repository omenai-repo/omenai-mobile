import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function extendArtworkExclusivity(art_id: string) {
  try {
    const response = await apiRequest(
      apiUrl + "/api/artworks/extendArtworkExclusivity",
      {
        method: "PUT",
        body: JSON.stringify({ art_id }),
      },
    );

    const result = await response.json();

    return {
      isOk: response.ok,
      message: result.message,
      data: result.data,
    };
  } catch {
    return {
      isOk: false,
      message:
        "An error was encountered, please try again later or contact support",
    };
  }
}
