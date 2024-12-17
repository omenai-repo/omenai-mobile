import { apiUrl, originHeader } from "constants/apiUrl.constants";

export async function createViewHistory(
  artwork: string,
  artist: string,
  art_id: string,
  user_id: string,
  url: string
) {
  try {
    const res = await fetch(`${apiUrl}/api/viewHistory/createViewHistory`, {
      method: "POST",
      headers: {
        'Origin': originHeader,
      },
      body: JSON.stringify({ artwork, artist, art_id, user_id, url }),
    });

    return { isOk: res.ok };
  } catch (error: any) {
    console.log(error);
  }
}
