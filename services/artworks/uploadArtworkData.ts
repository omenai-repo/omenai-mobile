import { apiUrl, authorization, originHeader, userAgent } from "../../constants/apiUrl.constants";
import { rollbar } from "../../config/rollbar.config";

export async function uploadArtworkData(data: Omit<ArtworkSchemaTypes, "art_id">) {
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
        body: await res.json(),
      };
      // Report 500+ errors to Rollbar
      if (res.status >= 500) {
        rollbar.error("UploadArtworkData API 500+ error", {
          status: res.status,
          url: `${apiUrl}/api/artworks/upload`,
          data,
          response: ParsedResponse.body,
        });
      }
      return ParsedResponse;
    });
    return response;
  } catch (error) {
    rollbar.error("UploadArtworkData API exception", {
      error,
      url: `${apiUrl}/api/artworks/upload`,
      data,
    });
    return {
      isOk: false,
      body: { message: "Error uploading artwork" },
    };
  }
}
