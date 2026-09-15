import { ArtworkSchemaTypes } from "#types/types";
import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/network/apiRequest";

export async function uploadArtworkData(
  data: Omit<
    ArtworkSchemaTypes,
    "art_id" | "availability" | "should_show_on_sub_active"
  >,
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
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error uploading artwork",
      },
    };
  }
}
