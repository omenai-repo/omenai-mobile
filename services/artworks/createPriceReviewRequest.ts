import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/apiRequest";

export async function createPriceReviewRequest(data: any) {
  try {
    const res = await apiRequest(`${apiUrl}/api/artworks/createPriceReviewRequest`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    const result = await res.json();

    return {
      isOk: res.ok,
      message: result.message,
      data: result.data,
      status: result.status,
      body: result,
    };
  } catch (error: any) {
    return {
      isOk: false,
      message:
        error?.message ||
        error?.response?.data?.message ||
        "An error was encountered, please try again later or contact support",
    };
  }
}
