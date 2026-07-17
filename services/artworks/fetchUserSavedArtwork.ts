import { apiUrl } from "../../constants/apiUrl.constants";
import { utils_getAsyncData } from "#utils/utils_asyncStorage";
import { apiRequest } from "../../utils/apiRequest";

export async function fetchUserSavedArtworks(page: number = 1) {
  let userId = "";
  const userSession = await utils_getAsyncData("userSession");
  if (userSession.value) {
    userId = JSON.parse(userSession.value).id;
  }
  //if there isn't a user id this should return
  if (userId.length < 1) return;

  let url = apiUrl + "/api/artworks/getUserSavedArtworks";

  try {
    const response = await apiRequest(url, {
      method: "POST",
      body: JSON.stringify({ id: userId, page }),
    });

    const result = await response.json();
    return {
      isOk: response.ok,
      message: result.message,
      data: result.data,
      count: result.pageCount,
      total: result.total,
    };
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error fetching saved artworks",
      },
    };
  }
}
