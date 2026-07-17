import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "../../../utils/apiRequest";

export async function fetchViewHistory(user_id: string) {
  try {
    const res = await apiRequest(`${apiUrl}/api/viewHistory/getViewHistory`, {
      method: "POST",
      body: JSON.stringify({ user_id }),
    });

    const result = await res.json();

    return { isOk: res.ok, message: result.message, data: result.data };
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error fetching view history",
      },
    };
  }
}
