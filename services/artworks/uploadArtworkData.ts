import { ArtworkSchemaTypes } from "#types/types";
import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function uploadArtworkData(
  data: Omit<ArtworkSchemaTypes, "art_id">,
) {
  try {
    const response = await apiRequest(`${apiUrl}/api/artworks/upload`, {
      method: "POST",
      body: JSON.stringify(data),
    }).then(async (res) => {
      const ParsedResponse = {
        isOk: res.ok,
        status: res.status,
        body: await res.json(),
      };
      return ParsedResponse;
    });
    return response;
  } catch (error: any) {
    return {
      isOk: false,
      status: error?.status,
      error: error,
      body: { message: "Error uploading artwork" },
    };
  }
}
