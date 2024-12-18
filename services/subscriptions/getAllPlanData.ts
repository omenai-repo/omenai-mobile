import { apiUrl, authorization, originHeader, userAgent } from "constants/apiUrl.constants";

export async function getAllPlanData() {
  try {
    const res = await fetch(`${apiUrl}/api/subscriptions/retrievePlans`, {
      method: "GET",
      headers: {
        'Origin': originHeader,
        "User-Agent": userAgent,
        "Authorization": authorization
      }
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
