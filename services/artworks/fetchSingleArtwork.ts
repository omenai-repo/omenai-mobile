import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function fetchsingleArtwork(art_id: string) {
  try {
    const response = await apiRequest(
      `${apiUrl}/api/artworks/getSingleArtwork`,
      {
        method: "POST",
        body: JSON.stringify({ art_id }),
      },
    ).then(async (res) => {
      const ParsedResponse = {
        isOk: res.ok,
        body: await res.json(),
      };

      return ParsedResponse;
    });

    return response;
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error fetching artwork details",
      },
    };
  }
}
