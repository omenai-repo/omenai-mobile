import { ArtworkSchemaTypes } from "#types/types";
import {
  apiUrl,
  authorization,
  originHeader,
  userAgent,
} from "../../constants/apiUrl.constants";

export async function uploadArtworkData(
  data: Omit<ArtworkSchemaTypes, "art_id">,
) {
  try {
    const response = await fetch(`${apiUrl}/api/artworks/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: originHeader,
        "User-Agent": userAgent,
        Authorization: authorization,
      },
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
      status: error?.status || 500,
      error: error,
      body: { message: "Error uploading artwork" },
    };
  }
}
