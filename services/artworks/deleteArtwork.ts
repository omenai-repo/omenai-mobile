import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function deleteArtwork(art_id: string) {
  try {
    const res = await apiRequest(`${apiUrl}/api/artworks/deleteArtwork`, {
      method: "POST",
      body: JSON.stringify({ art_id }),
    });

    const result = await res.json();

    return { isOk: res.ok, message: result.message };
  } catch (error: any) {
    console.log(error);
  }
}
