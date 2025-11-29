import { apiUrl, authorization, originHeader, userAgent } from "../../constants/apiUrl.constants";

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
    return { isOk: res.ok, message: result.message, data: result.data, plan: result.plan };
  } catch (error) {
    console.log(error);
  }
}
