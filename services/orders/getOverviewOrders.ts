import { apiUrl } from "../../constants/apiUrl.constants";
import { utils_getAsyncData } from "#utils/utils_asyncStorage";
import { apiRequest } from "../../utils/apiRequest";

export async function getOverviewOrders() {
  let userId = "";
  const userSession = await utils_getAsyncData("userSession");
  if (userSession.value) {
    userId = JSON.parse(userSession.value).id;
  } else {
    return;
  }

  try {
    const response = await apiRequest(
      `${apiUrl}/api/orders/getOrderByFilter?id=${userId}`,
      {
        method: "GET",
      },
    );

    const result = await response.json();
    return {
      isOk: response.ok,
      message: result.message,
      data: result.data,
    };
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error fetching orders",
      },
    };
  }
}
