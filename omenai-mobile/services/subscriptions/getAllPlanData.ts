import { apiUrl } from "../../constants/apiUrl.constants";

export async function getAllPlanData() {
  try {
    const res = await fetch(`${apiUrl}/api/subscriptions/retrievePlans`, {
      method: "GET",
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
