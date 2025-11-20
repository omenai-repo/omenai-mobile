import { utils_getAsyncData } from "utils/utils_asyncStorage";
import { apiUrl, authorization, originHeader, userAgent } from "../../constants/apiUrl.constants";
import { rollbar } from "../../config/rollbar.config";

export async function deleteGalleryAccount() {
  let id = "";
  const userSession = await utils_getAsyncData("userSession");
  if (userSession.value) {
    id = JSON.parse(userSession.value).id;
  } else {
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/api/requests/gallery/deleteAccount`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: originHeader,
        "User-Agent": userAgent,
        Authorization: authorization,
      },
      body: JSON.stringify({ gallery_id: id }),
    }).then(async (res) => {
      const result = await res.json();
      // Report 500+ errors to Rollbar
      if (res.status >= 500) {
        rollbar.error("DeleteGalleryAccount API 500+ error", {
          status: res.status,
          url: `${apiUrl}/api/requests/gallery/deleteAccount`,
          gallery_id: id,
          response: result,
        });
      }
      return { isOk: res.ok, message: result.message };
    });
    return response;
  } catch (error) {
    rollbar.error("DeleteGalleryAccount API exception", {
      error,
      url: `${apiUrl}/api/requests/gallery/deleteAccount`,
      gallery_id: id,
    });
    return {
      isOk: false,
      message: "Error deleting account",
    };
  }
}
