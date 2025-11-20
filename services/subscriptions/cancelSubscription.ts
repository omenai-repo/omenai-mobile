import { apiUrl, authorization, originHeader, userAgent } from "constants/apiUrl.constants";
import { rollbar } from "../../config/rollbar.config";

export async function cancelSubscription(gallery_id: string) {
  try {
    const url = `${apiUrl}/api/subscriptions/cancelSubscription`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Origin: originHeader,
        "User-Agent": userAgent,
        Authorization: authorization,
      },
      body: JSON.stringify({ gallery_id }),
    });

    const result = await res.json();
    // Report 500+ errors to Rollbar
    if (res.status >= 500) {
      rollbar.error("CancelSubscription API 500+ error", {
        status: res.status,
        url,
        gallery_id,
        response: result,
      });
    }
    return { isOk: res.ok, message: result.message };
  } catch (error: any) {
    rollbar.error("CancelSubscription API exception", { error, gallery_id });
    console.log(error);
  }
}
