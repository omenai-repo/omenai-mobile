import { apiUrl } from "constants/apiUrl.constants";

export async function downgradeSubscriptionPlan(
  data: NextChargeParams,
  gallery_id: string
) {
  try {
    const res = await fetch(
      `${apiUrl}/api/subscriptions/downgradeSubscriptionPlan`,
      {
        method: "POST",
        body: JSON.stringify({ data, gallery_id }),
      }
    );

    const result = await res.json();
    return { isOk: res.ok, message: result.message, data: result.data };
  } catch (error: any) {
    console.log(error);
  }
}
