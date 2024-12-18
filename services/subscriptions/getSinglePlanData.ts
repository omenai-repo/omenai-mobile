import { apiUrl, authorization, originHeader, userAgent } from "../../constants/apiUrl.constants";

export async function getSinglePlanData(plan_id: string) {
  try {
    const res = await fetch(`${apiUrl}/api/subscriptions/retrieveSinglePlan`, {
      method: "POST",
      headers: {
        'Origin': originHeader,
        "User-Agent": userAgent,
        "Authorization": authorization
      },
      body: JSON.stringify({ plan_id }),
    });

    const result = await res.json();

    return {
      isOk: res.ok,
      data: result.data,
    };
  } catch (error: any) {
    console.log(error);
  }
}
