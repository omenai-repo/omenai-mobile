import { apiUrl, originHeader } from "../../constants/apiUrl.constants";

export async function updateArtworkPrice(
  filter: ArtworkPriceFilterData,
  art_id: string
) {
  try {
    const res = await fetch(`${apiUrl}/api/artworks/updateArtworkPrice`, {
      method: "POST",
      headers: {
        'Origin': originHeader,
      },
      body: JSON.stringify({ filter, art_id }),
    });

    const result = await res.json();

    return { isOk: res.ok, message: result.message };
  } catch (error: any) {
    console.log(error);
  }
}
