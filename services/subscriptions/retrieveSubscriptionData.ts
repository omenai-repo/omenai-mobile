import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function retrieveSubscriptionData(gallery_id: string) {
  try {
    const url = `${apiUrl}/api/subscriptions/retrieveSubData`;
    const res = await apiRequest(url, {
      method: "POST",
      body: JSON.stringify({ gallery_id }),
    });

    const result = await res.json();
    return {
      isOk: res.ok,
      message: result.message,
      data: result.data,
      plan: result.plan,
    };
  } catch (error: any) {
    return {
      isOk: false,
      message:
        error?.message ||
        error?.response?.data?.message ||
        "An error occurred fetching subscription data",
    };
  }
}
