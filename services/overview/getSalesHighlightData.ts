import { utils_getAsyncData } from "#utils/utils_asyncStorage";
import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function getSalesHighlightData() {
  let userId = "";
  const userSession = await utils_getAsyncData("userSession");
  if (userSession.value) {
    userId = JSON.parse(userSession.value).id;
  } else {
    return;
  }
  try {
    const response = await apiRequest(`${apiUrl}/api/sales/getAllSalesById`, {
      method: "POST",
      body: JSON.stringify({ id: userId }),
    });
    const result = await response.json();
    return { isOk: response.ok, data: result.data };
  } catch (error) {
    return {
      isOk: false,
      body: { message: "Error fetching gallery artwork highlight" },
    };
  }
}
