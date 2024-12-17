import { apiUrl, originHeader } from "constants/apiUrl.constants";

export async function getAllPlanData() {
  try {
    const res = await fetch(`${apiUrl}/api/subscriptions/retrievePlans`, {
      method: "GET",
      headers: {
        'Origin': originHeader
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
