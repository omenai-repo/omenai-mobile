import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function requestArtworkPrice(art_id: string, user_id: string) {
  let url = apiUrl + "/api/requests/pricing/requestPrice";

  try {
    const response = await apiRequest(url, {
      method: "POST",
      body: JSON.stringify({ art_id, user_id }),
    });

    const result = await response.json();
    return { isOk: response.ok, message: result.message, data: result.data };
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error requesting price quote for artwork",
      },
    };
  }
}
