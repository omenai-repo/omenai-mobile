import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "../../../utils/apiRequest";

export async function createViewHistory(
  artwork: string,
  artist: string,
  art_id: string,
  user_id: string,
  url: string,
) {
  try {
    const res = await apiRequest(
      `${apiUrl}/api/viewHistory/createViewHistory`,
      {
        method: "POST",
        body: JSON.stringify({ artwork, artist, art_id, user_id, url }),
        shouldLogout: false,
      },
    );

    return { isOk: res.ok };
  } catch (error: any) {
    console.log(error);
  }
}
