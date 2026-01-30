import { utils_getAsyncData } from "#utils/utils_asyncStorage";
import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function getArtistCredentials() {
  let id = "";
  const userSession = await utils_getAsyncData("userSession");
  if (userSession.value) {
    id = JSON.parse(userSession.value).id;
  }
  if (id.length < 1) return;
  try {
    const response = await apiRequest(
      `${apiUrl}/api/requests/artist/fetchCredentials?id=${id}`,
      {
        method: "GET",
      },
    );

    const ParsedResponse = {
      isOk: response.ok,
      body: await response.json(),
    };

    return ParsedResponse;
  } catch (error) {
    return {
      isOk: false,
      body: { message: "Error fetch credentials" },
    };
  }
}
