import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/network/apiRequest";

export async function updatePriceReviewRequest(data: {
  artist_id: string;
  review_id: string;
  action: "ACCEPT" | "DECLINE";
  image_format: Record<string, any>;
}) {
  try {
    const res = await apiRequest(
      `${apiUrl}/api/artworks/updatePriceReviewRequest`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );

    const result = await res.json();

    return {
      isOk: res.ok,
      message: result?.message || result?.error || "",
      data: result?.data,
      body: result,
    };
  } catch (error: any) {
    return {
      isOk: false,
      message:
        error?.message ||
        error?.response?.data?.message ||
        "Unable to update this pricing proposal right now",
    };
  }
}
