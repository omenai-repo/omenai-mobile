import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/network/apiRequest";

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
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error updating artwork impressions",
      },
    };
  }
}
