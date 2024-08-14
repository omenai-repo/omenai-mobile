import { apiUrl } from "../../constants/apiUrl.constants";

export async function retrieveSubscriptionData(gallery_id: string) {
  try {

    const res = await fetch(`${apiUrl}/api/subscriptions/retrieveSubData`, {
      method: "POST",
      body: JSON.stringify({ gallery_id }),
    });

    const result = await res.json();
    console.log(result)

    return { isOk: res.ok, message: result.message, data: result.data };
  } catch (error) {
    console.log(error);
  }
}
