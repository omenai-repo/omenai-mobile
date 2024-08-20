import { apiUrl } from "constants/apiUrl.constants";

export async function createViewHistory(
  artwork: string,
  artist: string,
  art_id: string,
  user_id: string
) {
  try {
    const res = await fetch(`${apiUrl}/api/viewHistory/createViewHistory`, {
      method: "POST",

      body: JSON.stringify({ artwork, artist, art_id, user_id }),
    });

    return { isOk: res.ok };
  } catch (error: any) {
    console.log(error);
  }
}
