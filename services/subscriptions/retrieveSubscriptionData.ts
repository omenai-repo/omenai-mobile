import { apiUrl, authorization, originHeader, userAgent } from "../../constants/apiUrl.constants";
import { rollbar } from "../../config/rollbar.config";

export async function retrieveSubscriptionData(gallery_id: string) {
  try {
    const url = `${apiUrl}/api/subscriptions/retrieveSubData`;
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
      rollbar.error("RetrieveSubscriptionData API 500+ error", {
        status: res.status,
        url,
        gallery_id,
        response: result,
      });
    }
    return { isOk: res.ok, message: result.message, data: result.data, plan: result.plan };
  } catch (error) {
    rollbar.error("RetrieveSubscriptionData API exception", { error, gallery_id });
    console.log(error);
  }
}
