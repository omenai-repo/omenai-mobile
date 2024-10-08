import { apiUrl } from "constants/apiUrl.constants";

export async function createTokenizedCharge(
  data: SubscriptionTokenizationTypes
) {
  try {
    const res = await fetch(`${apiUrl}/api/subscriptions/createTokenizedCharge`, {
      method: "POST",
      body: JSON.stringify({ ...data }),
    });

    const result = await res.json();
    return { isOk: res.ok, message: result.message, data: result.data };
  } catch (error: any) {
    console.log(error);
  }
}
