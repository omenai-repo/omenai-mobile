import { apiUrl, authorization, originHeader, userAgent } from "constants/apiUrl.constants";

export async function cancelSubscription(gallery_id: string) {
  try {
    const res = await fetch(`${apiUrl}/api/subscriptions/cancelSubscription`, {
      method: "POST",
      headers: {
        'Origin': originHeader,
        "User-Agent": userAgent,
        "Authorization": authorization
      },
      body: JSON.stringify({ gallery_id }),
    });

    const result = await res.json();
    return { isOk: res.ok, message: result.message };
  } catch (error: any) {
    console.log(error);
  }
}
