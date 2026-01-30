import { apiUrl } from "../../constants/apiUrl.constants";
import { utils_getAsyncData } from "#utils/utils_asyncStorage";
import { apiRequest } from "../../utils/apiRequest";

export async function fetchCuratedArtworks({
  page,
  filters,
}: {
  page: number;
  filters?: any;
}) {
  let preferences = [];
  const userSession = await utils_getAsyncData("userSession");
  if (userSession.value) {
    preferences = JSON.parse(userSession.value).preferences;
  }

  let url = apiUrl + "/api/artworks/getUserCuratedArtworks";

  try {
    const response = await apiRequest(url, {
      method: "POST",
      body: JSON.stringify({ page, preferences, filters }),
    }).then(async (res) => {
      const result = await res.json();

      return result;
    });

    return response;
  } catch (error) {
    return {
      isOk: false,
      body: { message: "Error fetching arteorks" },
    };
  }
}
