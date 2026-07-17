import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function cancelSubscription(gallery_id: string) {
  try {
    const url = `${apiUrl}/api/subscriptions/cancelSubscription`;
    const res = await apiRequest(url, {
      method: "POST",
      body: JSON.stringify({ gallery_id }),
    });

    const result = await res.json();
    return { isOk: res.ok, message: result.message };
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error cancelling subscription",
      },
    };
  }
}
