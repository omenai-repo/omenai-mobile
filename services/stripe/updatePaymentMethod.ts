import { utils_getAsyncData } from "#utils/utils_asyncStorage";
import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export const updatePaymentMethod = async (setupIntentId: string) => {
  let gallery_id = "";
  const userSession = await utils_getAsyncData("userSession");
  if (userSession.value) {
    gallery_id = JSON.parse(userSession.value).id;
  }
  if (gallery_id.length < 1) return;
  try {
    const res = await apiRequest(
      `${apiUrl}/api/subscriptions/stripe/updatePaymentMethod`,
      {
        method: "PUT",
        body: JSON.stringify({
          setupIntentId,
          gallery_id,
        }),
      },
    );

    const result = await res.json();
    return {
      isOk: res.ok,
      message: result.message,
    };
  } catch (error: any) {
    return {
      isOk: false,
      message:
        "An error was encountered, please try again later or contact support",
    };
  }
};
