import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/network/apiRequest";

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
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error extending artwork exclusivity",
      },
    };
  }
}
