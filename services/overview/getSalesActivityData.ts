import { apiUrl } from "../../constants/apiUrl.constants";
import { utils_getAsyncData } from "#utils/utils_asyncStorage";
import { apiRequest } from "../../utils/apiRequest";

export async function getSalesActivityData(year?: string) {
  let sessionId = "";
  const userSession = await utils_getAsyncData("userSession");
  if (userSession.value) {
    sessionId = JSON.parse(userSession.value).id;
  } else {
    return;
  }

  try {
    const response = await apiRequest(`${apiUrl}/api/sales/getActivityById`, {
      method: "POST",
      body: JSON.stringify({ id: sessionId, year }),
    }).then(async (res) => {
      if (!res.ok) return undefined;
      const result = await res.json();

      return result;
    });

    return response;
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error fetching gallery artwork highlight",
      },
    };
  }
}
