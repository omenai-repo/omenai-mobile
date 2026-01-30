import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function updateArtworkImpressions(
  id: string,
  value: boolean,
  like_id: string,
) {
  try {
    const response = await apiRequest(
      `${apiUrl}/api/artworks/updateArtworkImpressions`,
      {
        method: "POST",
        body: JSON.stringify({ id, value, like_id }),
      },
    ).then(async (res) => {
      const result = await res.json();
      return { isOk: res.ok, message: result.message, data: result.data };
    });

    return response;
  } catch (error) {
    console.log("error" + error);
    return {
      isOk: false,
      body: { message: "Error updating artwork impressions" },
    };
  }
}
